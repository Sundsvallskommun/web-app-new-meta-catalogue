import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { getPermissions } from '@/services/authorization.service';
import { Permissions, InternalRoleMap } from '@/interfaces/users.interface';

type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<infer K, unknown> ? K : never;

export const hasPermissions = (permissions: Array<keyof Permissions>) => async (req: Request, res: Response, next: NextFunction) => {
  const userPermissions = req.user.permissions;
  if (permissions.every(permission => userPermissions[permission])) {
    next();
  } else {
    next(new HttpException(403, 'Missing permissions'));
  }
};

export const hasRoles = (roles: Array<KeyOfMap<InternalRoleMap>>) => async (req: Request, res: Response, next: NextFunction) => {
  const endpointPermissions = getPermissions(roles, true);
  const userPermissions = getPermissions(req.user.groups);
  if (
    Object.keys(endpointPermissions).every(
      permission => (endpointPermissions[permission] ? userPermissions[permission] : true) /* Return true for false values */,
    )
  ) {
    next();
  } else {
    next(new HttpException(403, 'Missing permissions'));
  }
};
