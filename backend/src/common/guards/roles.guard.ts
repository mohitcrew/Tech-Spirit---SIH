import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:Reflector){}
  canActivate(c:ExecutionContext){
    const roles=this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[c.getHandler(),c.getClass()]);
    if(!roles) return true;
    return roles.includes(c.switchToHttp().getRequest().user.role);
  }
}
