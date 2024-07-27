import { Injectable } from '@nestjs/common';
import { NodeSSH } from 'node-ssh';

@Injectable()
export class SshService {
  private ssh: NodeSSH;

  constructor() {
    this.ssh = new NodeSSH();
  }

  /**
   * Connects to the remote server using the provided SSH command and password.
   * @param sshCommand The SSH command containing the user and host information.
   * @param password The password for SSH authentication.
   * @returns The connection status: 'active', 'inactive', 'pending', or 'unauthorized'.
   */
  async connect(
    sshCommand: string,
    privateKey: string,
  ): Promise<'active' | 'inactive' | 'pending' | 'unauthorized'> {
    try {
      // Parse SSH command
      console.log('Parsing SSH command:', sshCommand);
      const [user, host] = sshCommand.replace('ssh ', '').split('@');
      const trimmedUser = user.trim();
      const trimmedHost = host.trim();

      // Log parsed values
      console.log('Connecting with the following details:');
      console.log('User:', trimmedUser);
      console.log('Host:', trimmedHost);
      console.log('privateKey:', privateKey);

      // Connect to the SSH server using the password
      await this.ssh.connect({
        host: trimmedHost,
        username: trimmedUser,
        privateKey,
        tryKeyboard: true, // Attempt keyboard-interactive authentication
        readyTimeout: 5000, // Set a connection timeout
        debug: (msg) => console.log('SSH DEBUG: ' + msg), // Verbose output
      });

      console.log('Connected to server successfully');
      return 'active';
    } catch (error) {
      console.error('Failed to connect:', error.message);
      console.error('Stack trace:', error.stack);
      return 'unauthorized';
    }
  }

  /**
   * Executes a command on the connected server and logs the results.
   * @param command The command to execute on the remote server.
   * @returns The stdout of the command execution.
   */
  async executeCommand(command: string): Promise<string> {
    try {
      console.log(`Executing command: ${command}`);
      const result = await this.ssh.execCommand(command);

      // Log the output and error
      console.log(`Command stdout: ${result.stdout}`);
      if (result.stderr) {
        console.error(`Command stderr: ${result.stderr}`);
        throw new Error(result.stderr);
      }

      return result.stdout;
    } catch (error) {
      console.error('Failed to execute command:', error.message);
      console.error('Stack trace:', error.stack);
      throw new Error('Command execution failed');
    }
  }

  /**
   * Disconnects the SSH session.
   */
  async disconnect(): Promise<void> {
    this.ssh.dispose();
    console.log('Disconnected from server');
  }
}
