import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { AbstractSingInUseCase, LoginResponse } from './AbstractSignIn';
import { JwtService } from '@nestjs/jwt';
import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { left, right } from 'src/domain/utils/either/either';
import { RequiredParametersError } from 'src/domain/utils/error/RequiredParametersError';
import { AuthErrorMessageEnum } from 'src/domain/enums/auth/ErrorMessage';

/**
 * Use case for authenticating a customer.
 *
 * @class
 * @implements {AbstractSingInUseCase}
 */
export class SignInUseCase implements AbstractSingInUseCase {
  /**
   * Creates an instance of SignInUseCase.
   *
   * @constructor
   * @param {AbstractCustomerRepository} customerRepository - The repository for customer data.
   * @param {AbstractPasswordHasher} passwordHasher - The password hasher provider.
   * @param {JwtService} jwtService - The JWT service for generating tokens.
   */
  constructor(
    private customerRepository: AbstractCustomerRepository,
    private jwtService: JwtService,
    private passwordHasher: AbstractPasswordHasher,
  ) {}

  /**
   * Signs in a customer and generates an access token.
   * @param {string} email - The email of the customer.
   * @param {string} password - The password of the customer.
   * @returns {Promise<LoginResponse>} A promise resolving to an object containing the access token.
   */
  async execute(email: string, password: string): Promise<LoginResponse> {
    const customer = await this.customerRepository.getCustomer({ email });
    if (!customer) {
      return left(
        new RequiredParametersError(AuthErrorMessageEnum.EmailOrPasswordWrong),
      );
    }

    const passwordMatch = await this.passwordHasher.comparePasswords(
      password,
      customer.password,
    );

    if (!passwordMatch) {
      return left(
        new RequiredParametersError(AuthErrorMessageEnum.EmailOrPasswordWrong),
      );
    }
    const payload = { sub: customer.id, email: customer.email };

    return right({
      access_token: await this.jwtService.signAsync(payload),
    });
  }
}
