import { Injectable } from '@nestjs/common';
import { AbstractAuthManager } from '../Auth';
import { AbstractCustomerRepository } from 'src/application/repositories/Customer';
import { JwtService } from '@nestjs/jwt';
import { AbstractPasswordHasher } from 'src/application/providers/PasswordHasher';
import { LoginResponse } from 'src/application/useCases/auth/signIn/AbstractSignIn';
import { SignInUseCase } from 'src/application/useCases/auth/signIn/SignIn';

@Injectable()
export class AuthManager implements AbstractAuthManager {
  constructor(
    private customerRepository: AbstractCustomerRepository,
    private jwtService: JwtService,
    private passwordHasher: AbstractPasswordHasher,
  ) {}

  /**
   * Signs in a customer and generates an access token.
   * @param {string} email - The customer's email.
   * @param {string} pass - The customer's password.
   * @returns {Promise<LoginResponse>} A promise resolving to an object containing the access token.
   */
  async signIn(email: string, pass: string): Promise<LoginResponse> {
    const signInUseCase = new SignInUseCase(
      this.customerRepository,
      this.jwtService,
      this.passwordHasher,
    );

    const result = await signInUseCase.execute(email, pass);
    return result;
  }
}
