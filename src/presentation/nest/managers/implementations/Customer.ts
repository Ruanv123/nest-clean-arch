import { Injectable } from '@nestjs/common';
import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import {
  AbstractCreateCustomerUseCase,
  CreateCustomerResponse,
} from 'src/application/useCases/Customer/Create/AbstractCreateCustomer';
import { CreateCustomerUseCase } from 'src/application/useCases/Customer/Create/CreateCustomer';
import { DeleteCustomerResponse } from 'src/application/useCases/Customer/Delete/AbstractDeleteCustomer';
import { DeleteCustomerUseCase } from 'src/application/useCases/Customer/Delete/DeleteCustomer';
import { CustomerResponse } from 'src/application/useCases/Customer/Read/AbstractReadCustomer';
import { GetCustomersResponse } from 'src/application/useCases/Customer/Read/AbstractReadCustomers';
import { ReadCustomerUseCase } from 'src/application/useCases/Customer/Read/ReadCustomer';
import { ReadCustomersUseCase } from 'src/application/useCases/Customer/Read/ReadCustomers';
import { UpdateCustomerUseCase } from 'src/application/useCases/Customer/Update/UpdateCustomer';
import { CreateCustomerRequestDTO } from 'src/domain/dtos/customer/Create';
import { ReadCustomersRequestDto } from 'src/domain/dtos/customer/ReadCustomers';
import { UpdateCustomerRequestDto } from 'src/domain/dtos/customer/Update';
import { AbstractCustomerManager } from '../Customer';

/**
 * Implementation of the service handling customer operations.
 */
@Injectable()
export class CustomerManager implements AbstractCustomerManager {
  /**
   * Constructs the CustomerManager.
   */
  constructor(
    private readonly customerRepository: AbstractCustomerRepository,
    private passwordHasher: AbstractPasswordHasher,
  ) {}

  /**
   * Executes the use case to create a customer.
   * @param {CreateCustomerRequestDto} createCustomerRequestDto - Data to create the customer.
   * @returns {Promise<Customer>} A promise resolving to the created customer.
   */
  async create(
    createCustomerRequestDto: CreateCustomerRequestDTO,
  ): Promise<CreateCustomerResponse> {
    const createCustomerUseCase: AbstractCreateCustomerUseCase =
      new CreateCustomerUseCase(this.customerRepository, this.passwordHasher);
    const result = await createCustomerUseCase.execute(
      createCustomerRequestDto,
    );
    return result;
  }

  /**
   * Retrieves all customers.
   * @returns {Promise<Customer[]>} A promise resolving to an array of all customers.
   */
  async getAll(
    readCustomersRequestDto: ReadCustomersRequestDto,
  ): Promise<GetCustomersResponse> {
    const readCustomersUseCase = new ReadCustomersUseCase(
      this.customerRepository,
    );
    const result = await readCustomersUseCase.execute(readCustomersRequestDto);
    return result;
  }

  /**
   * Retrieves a customer by ID.
   * @param {string} customerId - The ID of the customer to retrieve.
   * @returns {Promise<Customer | null>} The customer if found, or null if not found.
   */
  async getById(customerId: string): Promise<CustomerResponse> {
    const readCustomerUseCase = new ReadCustomerUseCase(
      this.customerRepository,
    );
    const result = await readCustomerUseCase.execute({ id: customerId });
    return result;
  }

  /**
   * Updates an existing customer.
   * @param {string} customerId - The ID of the customer to update.
   * @param {UpdateCustomerRequestDto} updateCustomerRequestDto - The data to update the customer.
   * @returns {Promise<Customer | null>} A promise resolving to the updated customer if found and updated, or null if not found.
   */
  async update(
    customerId: string,
    updateCustomerRequestDto: UpdateCustomerRequestDto,
  ): Promise<CustomerResponse> {
    const updateCustomerUseCase = new UpdateCustomerUseCase(
      this.customerRepository,
      this.passwordHasher,
    );
    const result = await updateCustomerUseCase.execute(
      customerId,
      updateCustomerRequestDto,
    );
    return result;
  }

  /**
   * Deletes a customer by ID.
   * @param {string} customerId - The ID of the customer to delete.
   * @returns {Promise<boolean>} A promise resolving to true if the customer was deleted successfully, false otherwise.
   */
  async delete(customerId: string): Promise<DeleteCustomerResponse> {
    const deleteCustomerUseCase = new DeleteCustomerUseCase(
      this.customerRepository,
    );
    const result = await deleteCustomerUseCase.execute(customerId);
    return result;
  }
}
