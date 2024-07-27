import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { exec } from 'child_process';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EncryptionService } from 'src/services/encryption.service';
import { SshService } from 'src/services/ssh.service';
import { SupabaseService } from 'src/services/supabase/supabase.service';

@Controller('instances')
export class InstancesController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly crypt: EncryptionService,
    private readonly ssh: SshService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createInstance(@Body() body: { userId: string }, @Req() req: Request) {
    const { userJwt } = req as any;
    console.group('userJwt', userJwt);
    // Handle instance creation logic here using sshCredentials
    return { message: 'Instance created', sshCredentials: '123' };
  }
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getAllInstances(
    @Param() params: { userId: string },
    @Req() req: Request,
  ) {
    const { userJwt } = req as any;
    console.group('userJwt', userJwt);
    console.group('userId', params.userId);
    const sshCredentials = await this.supabaseService.getSshCredentials(
      params.userId,
      userJwt,
    );
    console.log('ssg credentials', sshCredentials);
    const instances = await Promise.all(
      sshCredentials?.map(async (credential) => {
        if (!credential?.private_key || !credential?.public_key) {
          console.log('generating keys because there are none');
          const credentials_keys = await this.crypt.generateKeyPair();

          credential.public_key = this.crypt.encrypt(
            credentials_keys?.publicKey,
          );
          credential.private_key = this.crypt.encrypt(
            credentials_keys?.privateKey,
          );
          // console.log('saving instance', credential);
        }
        const decrypted = {
          ssh_command: this.crypt.decrypt(credential?.ssh_command),
          private_key: this.crypt.decrypt(credential?.private_key),
          public_key: this.crypt.decrypt(credential?.public_key),
        };
        const connectionStatus = await this.ssh.connect(
          decrypted?.ssh_command,
          decrypted?.private_key,
        );
        credential.status = connectionStatus;
        console.log('Update instance ...', credential);
        await this.supabaseService.putSshCredentials(userJwt, credential);

        delete decrypted.private_key;
        delete credential.private_key;

        return {
          ...credential,
          ...decrypted,
        };
      }),
    );

    // Retrieve and return all instances
    return instances;
  }
}
