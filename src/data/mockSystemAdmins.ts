import { SystemAdmin, PermissionLevel, SystemAdminStatus } from '@/types/system-admin';

export const mockSystemAdmins: SystemAdmin[] = [
  {
    id: 'sa-001',
    name: 'マスター管理者',
    email: 'master@example-system.com',
    permissionLevel: 'super_admin',
    status: 'active',
    lastLogin: new Date('2024-07-25T10:00:00Z'),
    createdAt: new Date('2023-01-15T09:00:00Z'),
  },
  {
    id: 'sa-002',
    name: '一般管理者A',
    email: 'admin.a@example-system.com',
    permissionLevel: 'admin',
    status: 'active',
    lastLogin: new Date('2024-07-24T15:30:00Z'),
    createdAt: new Date('2023-03-10T11:00:00Z'),
  },
  {
    id: 'sa-003',
    name: '読み取り専用ユーザー',
    email: 'readonly@example-system.com',
    permissionLevel: 'read_only',
    status: 'active',
    lastLogin: new Date('2024-07-20T08:45:00Z'),
    createdAt: new Date('2023-05-20T14:00:00Z'),
  },
  {
    id: 'sa-004',
    name: '休止中管理者',
    email: 'inactive.admin@example-system.com',
    permissionLevel: 'admin',
    status: 'inactive',
    lastLogin: new Date('2024-05-01T12:00:00Z'),
    createdAt: new Date('2023-02-01T16:00:00Z'),
  },
   {
    id: 'sa-005',
    name: '一般管理者B',
    email: 'admin.b@example-system.com',
    permissionLevel: 'admin',
    status: 'active',
    lastLogin: null, // Never logged in
    createdAt: new Date('2024-07-01T10:00:00Z'),
  },
];
