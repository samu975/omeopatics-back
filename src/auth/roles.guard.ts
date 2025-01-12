import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario autenticado, permitir el acceso (o podrías denegarlo si prefieres)
    if (!user) {
      return true; // o return false; si quieres denegar acceso
    }

    return requiredRoles.includes(user.role);
  }
}
