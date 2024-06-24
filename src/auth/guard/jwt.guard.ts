import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Guard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        'isPublic',
        [context.getHandler(), context.getClass()]
      );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext
  ) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Authentication failed'
        )
      );
    }

    const roles =
      this.reflector.getAllAndOverride<string[]>(
        'roles',
        [context.getHandler(), context.getClass()]
      );

    if (roles && !roles.includes(user.role)) {
      throw new UnauthorizedException(
        'Insufficient role permissions'
      );
    }

    return user;
  }
}
