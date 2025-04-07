import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import {
  AbstractDeleteCustomerUseCase,
  DeleteCustomerResponse,
} from './AbstractDeleteCustomer';
import { left, right } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';
import { CustomerErrorMessageEnum } from 'src/domain/enums/customer/ErrorMessage';

export class DeleteCustomerUseCase implements AbstractDeleteCustomerUseCase {
  /**
   * Creates an instance of DeleteCustomerUseCase.
   *
   * @constructor
   * @param {AbstractCustomerRepository} customerRepository - The repository for customer data.
   */
  constructor(private customerRepository: AbstractCustomerRepository) {}

  /**
   * Deletes a customer by ID.
   * @param {string} customerId - The ID of the customer to delete.
   * @returns {Promise<boolean>} A promise resolving to true if the customer was deleted successfully, false otherwise.
   */
  async execute(customerId: string): Promise<DeleteCustomerResponse> {
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
    const customerIsDeleted =
      await this.customerRepository.deleteCustomer(customerId);

    return right(customerIsDeleted);
  }
}
