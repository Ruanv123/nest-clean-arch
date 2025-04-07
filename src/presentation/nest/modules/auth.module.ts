import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { PasswordHasher } from 'src/infra/providers/PasswordHasher';
import { AuthController } from '../controllers/auth/Auth';
import { AuthGuard } from '../guards/auth/auth.guard';
import { AbstractAuthManager } from '../managers/Auth';
import { AuthManager } from '../managers/implementations/Auth';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: AbstractAuthManager,
      useClass: AuthManager,
    },
    // {
    //   provide: AbstractCustomerRepository,
    //   useClass:
    // },
    {
      provide: AbstractPasswordHasher,
      useClass: PasswordHasher,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
