import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

export interface RequestWithSession extends Request {
  cookies: {
    session?: string;
  };
  user: UserEntity;
}

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: RequestWithSession, res: Response, next: NextFunction) {
    const session = req.cookies['session'];

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    // !session;
    // validate session

    next();
  }
}
