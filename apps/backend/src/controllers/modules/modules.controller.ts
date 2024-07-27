import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EncryptionService } from 'src/services/encryption.service';
import { SshService } from 'src/services/ssh.service';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Controller('modules')
export class ModulesController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly crypt: EncryptionService,
    private readonly ssh: SshService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async installModule(
    @Body()
    installModuleDto: {
      instanceId: string;
      moduleName: string;
      userJwt: string;
      userId: string;
    },
  ) {
    const { instanceId, moduleName, userJwt, userId } = installModuleDto;

    try {
      // Retrieve SSH credentials from the database using userJwt and instanceId
      const sshCredentials = await this.supabaseService.getSshCredentials(
        userId,
        userJwt,
      );
      if (!sshCredentials) {
        throw new Error('Invalid SSH credentials');
      }
      const foundInstance = sshCredentials.find(
        (instance) => instance.uuid === instanceId,
      );
      if (!foundInstance) {
        throw new Error('Invalid SSH credentials');
      }
      const decrypted = {
        ssh_command: this.crypt.decrypt(foundInstance?.ssh_command),
        private_key: this.crypt.decrypt(foundInstance?.private_key),
      };
      // Connect to the remote server using SSH
      const connectionStatus = await this.ssh.connect(
        decrypted.ssh_command,
        decrypted.private_key,
      );

      if (connectionStatus !== 'active') {
        throw new Error('SSH connection failed');
      }

      // Check if Ansible and dependencies are installed, and install if not
      const checkAndInstallAnsibleCommand = `
export DEBIAN_FRONTEND=noninteractive &&
if ! command -v ansible >/dev/null 2>&1; then
  echo "Ansible is not installed. Installing Ansible..." &&
  sudo -E apt-get update -y &&
  sudo -E apt-get install -y software-properties-common &&
  sudo -E add-apt-repository --yes --update ppa:ansible/ansible &&
  sudo -E apt-get install -y ansible;
else
  echo "Ansible is already installed.";
fi
`;
      await this.ssh.executeCommand(checkAndInstallAnsibleCommand);
      // Define the GitHub repository URL and the playbook path
      const repoUrl = 'https://github.com/brunohanss/DeployBuddy';
      const playbookPath =
        'apps/backend/src/ansible/playbooks/install_fullstack_monitoring.yml';

      // Define the command to execute Ansible playbook on the remote server
      const command = `ansible-pull -U ${repoUrl} ${playbookPath} --extra-vars "module_name=${moduleName}"`;

      // Execute the command on the remote server
      const output = await this.ssh.executeCommand(command);

      // Disconnect from the SSH session
      await this.ssh.disconnect();

      return {
        message: `Module ${moduleName} installation initiated on instance ${instanceId}`,
        output: output,
      };
    } catch (error) {
      return {
        message: `Failed to initiate module ${moduleName} installation on instance ${instanceId}`,
        error: error.message,
      };
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllModules() {
    // Retrieve and return all available modules
    // This can be static or dynamically fetched from a database or a config
    return {
      installed: [],
      all: [{ name: 'FullStack Monitor' }],
    };
  }

  @Delete(':moduleId')
  async removeModule(@Param('moduleId') moduleId: string) {
    // Logic to remove the module from the instance
    // Could involve triggering an Ansible playbook for cleanup
    return { id: 1, message: `Module ${moduleId} removed` };
  }
}
