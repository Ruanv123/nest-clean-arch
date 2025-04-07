/* eslint-disable @typescript-eslint/unbound-method */
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { DeleteCustomerUseCase } from './DeleteCustomer';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';
import { CustomerErrorMessageEnum } from 'src/domain/enums/customer/ErrorMessage';
import { left } from 'src/domain/utils/either/either';

describe('DeleteCustomerUseCase', () => {
  let customerRepository: AbstractCustomerRepository;
  let deleteCustomerUseCase: DeleteCustomerUseCase;
  const customerDoesNotExist = left(
    new RequiredParametersError(
      CustomerErrorMessageEnum.CustomerDoesNotExist,
      400,
    ),
  );

  beforeEach(() => {
    customerRepository = {
      getCustomer: jest.fn(),
      deleteCustomer: jest.fn(),
    } as unknown as AbstractCustomerRepository;

    deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);
  });

  it('should return error when customer does not exist', async () => {
    (customerRepository.getCustomer as jest.Mock).mockResolvedValue(null);

    const result = await deleteCustomerUseCase.execute('customer_id');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RequiredParametersError);
    expect(result.value).toStrictEqual(customerDoesNotExist.value);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith({
      id: 'customer_id',
    });
    expect(customerRepository.deleteCustomer).not.toHaveBeenCalled();
  });

  it('should return true when customer is deleted successfully', async () => {
    (customerRepository.getCustomer as jest.Mock).mockResolvedValue({});
    (customerRepository.deleteCustomer as jest.Mock).mockResolvedValue(true);

    const result = await deleteCustomerUseCase.execute('customer_id');

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith({
      id: 'customer_id',
    });
    expect(customerRepository.deleteCustomer).toHaveBeenCalledWith(
      'customer_id',
    );
  });

  it('should return false when customer deletion fails', async () => {
    (customerRepository.getCustomer as jest.Mock).mockResolvedValue({});
    (customerRepository.deleteCustomer as jest.Mock).mockResolvedValue(false);

    const result = await deleteCustomerUseCase.execute('customer_id');

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(false);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith({
      id: 'customer_id',
    });
    expect(customerRepository.deleteCustomer).toHaveBeenCalledWith(
      'customer_id',
    );
  });
});
