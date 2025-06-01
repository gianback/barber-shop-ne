import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { compareSync } from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail({
        email: loginDto.email,
      });

      if (!user) {
        throw new BadRequestException(`El email ${loginDto.email} no existe`);
      }

      const isValidPassword = compareSync(loginDto.password, user.password);

      if (isValidPassword === false) {
        throw new BadRequestException('Credenciales incorrectas');
      }

      return {
        token: this.getJwtToken({ email: user.email }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);

    const token = this.getJwtToken({ email: user.email });

    return { token };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleDbErrors(error: { code: string; detail: string }) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException();
  }
}
