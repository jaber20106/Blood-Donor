import { SetMetadata } from '@nestjs/common';
import { PermissionName } from '../../modules/permission/permission.service';

export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permissions: PermissionName[]) =>
  SetMetadata(PERMISSION_KEY, permissions);