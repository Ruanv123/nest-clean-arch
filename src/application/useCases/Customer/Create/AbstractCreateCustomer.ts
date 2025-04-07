import { CreateCustomerRequestDTO } from 'src/domain/dtos/customer/Create';
import { Customer } from 'src/domain/entities/Customer';
import { Either } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';

/**
 * Represents the response of creating a customer, which can either be a success (Right) containing the created customer
 * or a failure (Left) containing a RequiredParametersError indicating missing parameters.
 */
export type CreateCustomerResponse = Either<RequiredParametersError, Customer>;

/**
 * Abstract class defining the contract for the use case of creating a new customer.
 */
export abstract class AbstractCreateCustomerUseCase {
  /**
   * Executes the create customer use case asynchronously.
   *
   * @async
   * @param {CreateCustomerRequestDto} createCustomerRequestDto - Data representing the request to create a customer.
   * @returns {Promise<CreateCustomerResponse>} A promise resolving to the response data.
   */
  abstract execute(
    CreateCustomerRequestDto: CreateCustomerRequestDTO,
  ): Promise<CreateCustomerResponse>;
}
