import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET') || '',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { email } = payload;

    const user = await this.userService.findByEmail({ email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
