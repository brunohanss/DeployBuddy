import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';
@Injectable()
export class SupabaseService {
  private readonly supabaseUrl = 'https://vmdpxaongmlurzagvitd.supabase.co';
  private readonly supabaseFunctionEndpoint = '/functions/v1';

  constructor(private readonly httpService: HttpService) {}

  async getSshCredentials(
    userId: string,
    jwtToken: string,
  ): Promise<Instance[]> {
    const url = `${this.supabaseUrl}${this.supabaseFunctionEndpoint}/get-ssh-credentials`;
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };
    const response = await firstValueFrom(
      this.httpService.post(url, { user_id: userId }, { headers }),
    );
    return response.data.data;
  }
  async putSshCredentials(
    jwtToken: string,
    credentials: Instance,
  ): Promise<Instance[]> {
    const url = `${this.supabaseUrl}${this.supabaseFunctionEndpoint}/put-ssh-credentials`;
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };
    const response = await firstValueFrom(
      this.httpService.post(url, { ...credentials }, { headers }),
    );
    return response.data.data;
  }
}

interface Instance {
  id: number;
  created_at: string;
  user_id: string;
  name: string;
  ssh_command: string;
  status: 'active' | 'inactive' | 'pending' | 'unauthorized';
  uuid: string;
  private_key?: string;
  public_key?: string;
}
