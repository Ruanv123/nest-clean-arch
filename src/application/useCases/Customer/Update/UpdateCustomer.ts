import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { UpdateCustomerRequestDto } from 'src/domain/dtos/customer/Update';
import { CustomerErrorMessageEnum } from 'src/domain/enums/customer/ErrorMessage';
import { left, right } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';
import {
  AbstractUpdateCustomerUseCase,
  CustomerResponse,
} from './AbstractUpdateCustomer';

/**
 * Use case for updating customer information.
 *
 * @class
 * @implements {AbstractUpdateCustomerUseCase}
 */
export class UpdateCustomerUseCase implements AbstractUpdateCustomerUseCase {
  /**
   * Creates an instance of UpdateCustomerUseCase.
   *
   * @constructor
   * @param {AbstractCustomerRepository} customerRepository - The repository for customer data.
   * @param {AbstractPasswordHasher} passwordHasher - The password hasher provider.
   */
  constructor(
    private customerRepository: AbstractCustomerRepository,
    private passwordHasher: AbstractPasswordHasher,
  ) {}

  /**
   * Executes the update customer use case.
   *
   * @async
   * @param {string} customerId - The ID of the customer to be updated.
   * @param {UpdateCustomerRequestDto} requestData - The updated customer information.
   * @returns {Promise<CustomerResponse>} The response data containing the updated customer information.
   */
  async execute(
    customerId: string,
    updateCustomerRequestDto: UpdateCustomerRequestDto,
  ): Promise<CustomerResponse> {
    const customer = await this.customerRepository.getCustomer({
      id: customerId,
    });
    if (!customer) {
      return left(
        new RequiredParametersError(
          CustomerErrorMessageEnum.CustomerDoesNotExist,
          400,
        ),
      );
    }
    if (updateCustomerRequestDto.password) {
      updateCustomerRequestDto.password =
        await this.passwordHasher.hashPassword(
          updateCustomerRequestDto.password,
        );
    }
    const customerUpdated = await this.customerRepository.updateCustomer(
      customerId,
      updateCustomerRequestDto,
    );
    return right(customerUpdated);
  }
}
