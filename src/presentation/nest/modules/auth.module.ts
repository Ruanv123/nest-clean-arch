import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AbstractPasswordHasher } from '../../../application/providers/PasswordHasher';
import { AuthController } from '../controllers/auth/Auth';
import { AuthGuard } from '../guards/auth/auth.guard';
import { AbstractAuthManager } from '../managers/Auth';
import { AuthManager } from '../managers/implementations/Auth';
import { AbstractCustomerManager } from '../managers/Customer';
import { CustomerManager } from '../managers/implementations/Customer';
import { AbstractCustomerRepository } from '../../../application/repositories/Customer';
import { PrismaCustomerRepository } from '../../../infra/repositories/PrismaCustomer';
import { PrismaService } from '../../../infra/database/nestPrisma/prisma.service';
import { PasswordHasher } from '../../../infra/providers/PasswordHasher';

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
      provide: AbstractCustomerManager,
      useClass: CustomerManager,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: AbstractAuthManager,
      useClass: AuthManager,
    },
    {
      provide: AbstractCustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    {
      provide: AbstractPasswordHasher,
      useClass: PasswordHasher,
    },
    PrismaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
