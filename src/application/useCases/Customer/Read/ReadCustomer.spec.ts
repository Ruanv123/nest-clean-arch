/* eslint-disable @typescript-eslint/unbound-method */
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { left } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';
import { ReadCustomerUseCase } from './ReadCustomer';
import { ReadCustomerRequestDto } from 'src/domain/dtos/customer/ReadCustomer';
import { randomUUID } from 'crypto';
import { CustomerErrorMessageEnum } from 'src/domain/enums/customer/ErrorMessage';

describe('ReadCustomerUseCase', () => {
  let customerRepository: AbstractCustomerRepository;
  let readCustomerUseCase: ReadCustomerUseCase;
  const customerNotFound = left(
    new RequiredParametersError(CustomerErrorMessageEnum.CustomerNotFound, 404),
  );

  beforeEach(() => {
    customerRepository = {
      getCustomer: jest.fn(),
    } as unknown as AbstractCustomerRepository;

    readCustomerUseCase = new ReadCustomerUseCase(customerRepository);
  });

  it('should return customer response when customer exists', async () => {
    const mockCustomerResponse = { id: '1', name: 'John Doe' };
    const mockReadCustomerRequestDto: ReadCustomerRequestDto = {
      email: 'John.Doe@example.com',
      id: randomUUID(),
    };

    (customerRepository.getCustomer as jest.Mock).mockResolvedValue(
      mockCustomerResponse,
    );

    const result = await readCustomerUseCase.execute(
      mockReadCustomerRequestDto,
    );

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(mockCustomerResponse);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith(
      mockReadCustomerRequestDto,
    );
  });

  it('should return error when customer does not exist', async () => {
    const mockReadCustomerRequestDto: ReadCustomerRequestDto = {
      email: 'John.Doe@example.com',
      id: randomUUID(),
    };

    (customerRepository.getCustomer as jest.Mock).mockResolvedValue(null);

    const result = await readCustomerUseCase.execute(
      mockReadCustomerRequestDto,
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value?.constructor).toBe(RequiredParametersError);
    expect(result.value).toStrictEqual(customerNotFound.value);
    expect(customerRepository.getCustomer).toHaveBeenCalledWith(
      mockReadCustomerRequestDto,
    );
  });
});
