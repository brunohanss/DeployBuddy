import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/services/supabase/supabase.service';
import { Request } from 'express';
import { EncryptionService } from 'src/services/encryption.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly crypt: EncryptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.log('error finding token');
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtToken = authHeader.replace('Bearer ', '');
    console.log('jwt token', jwtToken);

    try {
      // Decrypt the JWT token
      const decryptedToken = this.crypt.decrypt(jwtToken);

      if (!decryptedToken) {
        console.log('error decrypting token');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Attach jwt info to request for further use
      (request as any).body.userJwt = decryptedToken;
      return true;
    } catch (error) {
      console.log('Wtf error', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
