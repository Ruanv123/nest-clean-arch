import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { AbstractUpdateCustomerUseCase } from './AbstractUpdateCustomer';
import { UpdateCustomerRequestDto } from 'src/domain/dtos/customer/Update';
import { Customer } from 'src/domain/entities/Customer';
import { left } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';
import { CustomerErrorMessageEnum } from 'src/domain/enums/customer/ErrorMessage';
import { UpdateCustomerUseCase } from './UpdateCustomer';

describe('UpdateCustomerUseCase', () => {
  let customerRepository: AbstractCustomerRepository;
  let passwordHasher: AbstractPasswordHasher;
  let updateCustomerUseCase: AbstractUpdateCustomerUseCase;

  const customerId = 'customer123';
  const updateCustomerRequestDto: UpdateCustomerRequestDto = {
    firstName: 'John',
    lastName: 'Doe',
    password: 'newPassword',
  };
  const mockCustomer: Customer = {
    id: customerId,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'test',
    createdAt: new Date(),
  };
  const customerDoesNotExist = left(
    new RequiredParametersError(
      CustomerErrorMessageEnum.CustomerDoesNotExist,
      400,
    ),
  );

  beforeEach(() => {
    customerRepository = {
      getCustomer: jest.fn(),
      updateCustomer: jest.fn(),
    } as unknown as AbstractCustomerRepository;

    passwordHasher = {
      hashPassword: jest.fn(),
    } as unknown as AbstractPasswordHasher;

    updateCustomerUseCase = new UpdateCustomerUseCase(
      customerRepository,
      passwordHasher,
    );
  });

  it('should update customer information', async () => {
    (customerRepository.getCustomer as jest.Mock).mockResolvedValue(
      mockCustomer,
    );
    (customerRepository.updateCustomer as jest.Mock).mockResolvedValue(
      mockCustomer,
    );

    const result = await updateCustomerUseCase.execute(
      customerId,
      updateCustomerRequestDto,
    );

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(mockCustomer);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith({
      id: customerId,
    });
    expect(customerRepository.updateCustomer).toHaveBeenCalledWith(
      customerId,
      updateCustomerRequestDto,
    );
  });

  it('should return error when customer does not exist', async () => {
    (customerRepository.getCustomer as jest.Mock).mockResolvedValue(null);

    const result = await updateCustomerUseCase.execute(
      customerId,
      updateCustomerRequestDto,
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value?.constructor).toBe(RequiredParametersError);
    expect(result.value).toStrictEqual(customerDoesNotExist.value);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith({
      id: customerId,
    });
    expect(passwordHasher.hashPassword).not.toHaveBeenCalled();
    expect(customerRepository.updateCustomer).not.toHaveBeenCalled();
  });
});
