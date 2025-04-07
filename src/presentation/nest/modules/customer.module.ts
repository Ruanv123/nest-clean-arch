import { Module } from '@nestjs/common';
import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { PrismaService } from 'src/infra/database/nestPrisma/prisma.service';
import { PasswordHasher } from 'src/infra/providers/PasswordHasher';
import { PrismaCustomerRepository } from 'src/infra/repositories/PrismaCustomer';
import { CustomersController } from '../controllers/customer/Customer';
import { AbstractCustomerManager } from '../managers/Customer';
import { CustomerManager } from '../managers/implementations/Customer';

@Module({
  controllers: [CustomersController],
  providers: [
    {
      provide: AbstractCustomerManager,
      useClass: CustomerManager,
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
})
export class CustomerModule {}
