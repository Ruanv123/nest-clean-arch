import { Injectable } from '@nestjs/common';
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { CreateCustomerRequestDTO } from 'src/domain/dtos/customer/Create';
import { ReadCustomerRequestDto } from 'src/domain/dtos/customer/ReadCustomer';
import { ReadCustomersRequestDto } from 'src/domain/dtos/customer/ReadCustomers';
import { UpdateCustomerRequestDto } from 'src/domain/dtos/customer/Update';
import { Customer } from 'src/domain/entities/Customer';
import { PrismaService } from '../database/nestPrisma/prisma.service';

@Injectable()
export class PrismaCustomerRepository implements AbstractCustomerRepository {
  /**
   * Constructs the PrismaCustomerRepository.
   * @param {PrismaService} prisma - The Prisma service for database access.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new customer.
   * @param {CreateCustomerRequestDto} CreateCustomerRequestDto - Data to create the customer.
   * @returns {Promise<Customer>} The created customer.
   */
  async createCustomer(
    CreateCustomerRequestDto: CreateCustomerRequestDTO,
  ): Promise<Customer> {
    const createdPrismaCustomer = await this.prisma.customer.create({
      data: {
        email: CreateCustomerRequestDto.email.toString(),
        firstName: CreateCustomerRequestDto.firstName,
        lastName: CreateCustomerRequestDto.lastName,
        password: CreateCustomerRequestDto.password.toString(),
        createdAt: new Date(),
      },
    });

    return this.mapPrismaCustomerToCustomerEntity(createdPrismaCustomer);
  }

  /**
   * Retrieves a customer based on the provided data.
   * @param {ReadCustomersRequestDto} data - The data of the customer to retrieve.
   * @returns {Promise<Customer | null>} The customer if found, or null if not found.
   */
  async getCustomer(data: ReadCustomerRequestDto): Promise<Customer | null> {
    const { email, id } = data;

    const where = {
      ...(email && { email }),
      ...(id && { id }),
    };

    if (id) where.id = id;
    else if (email) where.email = email;

    const customer = await this.prisma.customer.findUnique({
      where: id ? { id } : { email },
    });
    return customer ? this.mapPrismaCustomerToCustomerEntity(customer) : null;
  }

  /**
   * Retrieves customers based on the provided data.
   * @param {ReadCustomersRequestDto} data - The data to filter customers.
   * @returns {Promise<Customer[]>} An array of customers that match the criteria.
   */
  async getCustomers(data: ReadCustomersRequestDto): Promise<Customer[]> {
    const { email, id, firstName, lastName } = data;

    const where = {
      ...(email && { email }),
      ...(id && { id }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };

    const customers = await this.prisma.customer.findMany({ where });

    return customers.map((customer) =>
      this.mapPrismaCustomerToCustomerEntity(customer),
    );
  }
  /**
   * Updates a customer.
   * @param {string} customerId - The ID of the customer to update.
   * @param {UpdateCustomerRequestDto} UpdateCustomerRequestDto - Data to update the customer.
   * @returns {Promise<Customer | null>} The updated customer if found and updated, or null if not found.
   */
  async updateCustomer(
    customerId: string,
    UpdateCustomerRequestDto: UpdateCustomerRequestDto,
  ): Promise<Customer | null> {
    const updatedCustomer = await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        email: UpdateCustomerRequestDto.email?.toString(),
        firstName: UpdateCustomerRequestDto.firstName,
        lastName: UpdateCustomerRequestDto.lastName,
        password: UpdateCustomerRequestDto.password?.toString(),
      },
    });
    return updatedCustomer
      ? this.mapPrismaCustomerToCustomerEntity(updatedCustomer)
      : null;
  }

  /**
   * Deletes a customer by ID.
   * @param {string} customerId - The ID of the customer to delete.
   * @returns {Promise<boolean>} True if the customer was deleted successfully, false otherwise.
   */
  async deleteCustomer(customerId: string): Promise<boolean> {
    const deletedCustomer = await this.prisma.customer.delete({
      where: {
        id: customerId,
      },
    });
    return !!deletedCustomer;
  }

  /**
   * Maps a Prisma customer object to a Customer entity.
   * @param {any} prismaCustomer - The Prisma customer object.
   * @returns {Customer} The Customer entity.
   */
  private mapPrismaCustomerToCustomerEntity(prismaCustomer: any): Customer {
    return {
      id: prismaCustomer.id,
      email: prismaCustomer.email,
      firstName: prismaCustomer.firstName,
      lastName: prismaCustomer.lastName,
      password: prismaCustomer.password,
      createdAt: prismaCustomer.createdAt,
    };
  }
}
