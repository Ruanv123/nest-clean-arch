import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { CreateCustomerUseCase } from './CreateCustomer';
import { CreateCustomerRequestDTO } from 'src/domain/dtos/customer/Create';
import { Customer } from 'src/domain/entities/Customer';
import { left } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';
import { CustomerErrorMessageEnum } from 'src/domain/enums/customer/ErrorMessage';

describe('CreateCustomerUseCase', () => {
  let customerRepository: AbstractCustomerRepository;
  let passwordHasher: AbstractPasswordHasher;
  let createCustomerUseCase: CreateCustomerUseCase;
  const createCustomerRequestDto: CreateCustomerRequestDTO = {
    email: 'test@example.com',
    password: 'password',
    firstName: 'test',
    lastName: 'test',
  };
  const mockCustomer: Customer = {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    firstName: 'test',
    lastName: 'test',
    createdAt: new Date(),
  };

  const customerAlreadyExists = left(
    new RequiredParametersError(
      CustomerErrorMessageEnum.CustomerAlreadyExists,
      400,
    ),
  );

  beforeEach(() => {
    customerRepository = {
      getCustomer: jest.fn(),
      createCustomer: jest.fn(),
      getAllCustomers: jest.fn(),
      getCustomerById: jest.fn(),
      updateCustomer: jest.fn(),
      deleteCustomer: jest.fn(),
    } as unknown as AbstractCustomerRepository;

    passwordHasher = {
      hashPassword: jest.fn(),
    } as unknown as AbstractPasswordHasher;

    createCustomerUseCase = new CreateCustomerUseCase(
      customerRepository,
      passwordHasher,
    );
  });

  it('should create a new customer when customer does not exist', async () => {
    (customerRepository.getCustomer as jest.Mock).mockResolvedValue(null);
    (passwordHasher.hashPassword as jest.Mock).mockResolvedValue(
      'hashedPassword',
    );
    (customerRepository.createCustomer as jest.Mock).mockResolvedValue(
      mockCustomer,
    );

    const result = await createCustomerUseCase.execute(
      createCustomerRequestDto,
    );

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(mockCustomer);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith({
      email: createCustomerRequestDto.email,
    });
    expect(passwordHasher.hashPassword).toHaveBeenCalledWith(
      createCustomerRequestDto.password,
    );
    expect(customerRepository.createCustomer).toHaveBeenCalledWith({
      ...createCustomerRequestDto,
      password: 'hashedPassword',
    });
  });

  it('should return error when customer already exists', async () => {
    (customerRepository.getCustomer as jest.Mock).mockResolvedValue({});

    const result = await createCustomerUseCase.execute(
      createCustomerRequestDto,
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value.constructor).toBe(RequiredParametersError);
    expect(result.value).toStrictEqual(customerAlreadyExists.value);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith({
      email: createCustomerRequestDto.email,
    });
    expect(passwordHasher.hashPassword).not.toHaveBeenCalled();
    expect(customerRepository.createCustomer).not.toHaveBeenCalled();
  });
});
