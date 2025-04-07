import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractCustomersController } from 'src/application/controllers/Customer';
import { CreateCustomerRequestDTO } from 'src/domain/dtos/customer/Create';
import { ReadCustomersRequestDto } from 'src/domain/dtos/customer/ReadCustomers';
import { UpdateCustomerRequestDto } from 'src/domain/dtos/customer/Update';
import { Customer } from 'src/domain/entities/Customer';
import { Public } from '../../helpers/customDecorator/Public';
import { AbstractCustomerManager } from '../../managers/Customer';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController implements AbstractCustomersController {
  constructor(private readonly CustomerManager: AbstractCustomerManager) {}

  /**
   * Endpoint for creating a new customer.
   * @param {CreateCustomerRequestDto} createCustomerRequestDto - Data representing the request to create a customer.
   * @returns {Promise<Customer>} A promise resolving to the created customer.
   */
  @Post()
  @Public()
  async create(
    @Body() createCustomerRequestDto: CreateCustomerRequestDTO,
  ): Promise<Customer> {
    const result = await this.CustomerManager.create(createCustomerRequestDto);
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
    return result.value;
  }

  /**
   * Endpoint for retrieving a customer by ID.
   * @param {string} customerId - The ID of the customer to retrieve.
   * @returns {Promise<Customer>} A promise resolving to the customer if found, otherwise null.
   */
  @Get(':id')
  async getById(@Param('id') customerId: string): Promise<Customer | null> {
    const result = await this.CustomerManager.getById(customerId);
    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
    return result.value;
  }

  /**
   * Endpoint for updating an existing customer.
   * @param {string} customerId - The ID of the customer to update.
   * @param {UpdateCustomerRequestDto} updateCustomerRequestDto - Data representing the request to update the customer.
   * @returns {Promise<Customer>} A promise resolving to the updated customer if found and updated, otherwise null.
   */
  @Put(':id')
  async update(
    @Param('id') customerId: string,
    @Body() updateCustomerRequestDto: UpdateCustomerRequestDto,
  ): Promise<Customer | null> {
    const result = await this.CustomerManager.update(
      customerId,
      updateCustomerRequestDto,
    );
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }

  /**
   * Endpoint for deleting a customer by ID.
   * @param {string} customerId - The ID of the customer to delete.
   * @returns {Promise<boolean>} A promise resolving to true if the customer was deleted successfully, otherwise false.
   */
  @Delete(':id')
  async delete(@Param('id') customerId: string): Promise<boolean> {
    const result = await this.CustomerManager.delete(customerId);
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
    return result.value;
  }

  /**
   * Endpoint for retrieving all customers.
   * @param {ReadCustomersRequestDto} query - Data representing the request to read customers.
   * @returns {Promise<Customer[]>} A promise resolving to an array containing all customers.
   */
  @Get()
  async getAll(@Query() query: ReadCustomersRequestDto): Promise<Customer[]> {
    const result = await this.CustomerManager.getAll(query);
    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
    return result.value;
  }
}
