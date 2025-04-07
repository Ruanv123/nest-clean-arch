import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginRequestDTO } from 'src/domain/dtos/auth/Login';
import { Public } from '../../helpers/customDecorator/Public';
import { AbstractAuthManager } from '../../managers/Auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authManager: AbstractAuthManager) {}

  /**
   * Endpoint for customer login.
   * @param {LoginRequestDTO} signInDto - The login request DTO.
   * @returns {Promise<any>} The result of the login operation.
   */
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: LoginRequestDTO) {
    const result = await this.authManager.signIn(
      signInDto.email,
      signInDto.password,
    );
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }
}
