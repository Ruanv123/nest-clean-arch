import { ReadCustomerRequestDto } from 'src/domain/dtos/customer/ReadCustomer';
import { Customer } from 'src/domain/entities/Customer';
import { Either } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';

export type CustomerResponse = Either<RequiredParametersError, Customer | null>;

/**
 * Abstract class for GetAllCustomerUseCase.
 *
 */
export abstract class AbstractReadCustomerUseCase {
  /**
   * Executes the get all customers use case.
   *
   * @async
   * @param {ReadCustomerRequestDto} data - The data containing parameters for customer retrieval, such as filters and pagination settings.
   * @returns {Promise<CustomerResponse>} The response data containing customer information.
   */
  abstract execute(data: ReadCustomerRequestDto): Promise<CustomerResponse>;
}
