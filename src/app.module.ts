import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'nestjs-dotenv';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
