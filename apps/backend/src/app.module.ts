import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Logger } from './services/logger.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { InstancesController } from './controllers/instances/instances.controller';
import { ModulesController } from './controllers/modules/modules.controller';
import { SupabaseService } from './services/supabase/supabase.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EncryptionService } from './services/encryption.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SshService } from './services/ssh.service';
@Module({
  imports: [
    HttpModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, InstancesController, ModulesController],
  providers: [
    AppService,
    SupabaseService,
    Logger,
    EncryptionService,
    SshService,
  ],
})
export class AppModule {}
