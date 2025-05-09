export type PermissionLevel = 'super_admin' | 'admin' | 'read_only';

export type SystemAdminStatus = 'active' | 'inactive';

export type SystemAdmin = {
  id: string;
  name: string;
  email: string;
  permissionLevel: PermissionLevel;
  status: SystemAdminStatus;
  lastLogin: Date | null; // Optional: Add last login date
  createdAt: Date;
};

// Helper function to map permission level ID to display name
export const getPermissionLevelName = (level: PermissionLevel): string => {
  switch (level) {
    case 'super_admin': return 'スーパー管理者';
    case 'admin': return '管理者';
    case 'read_only': return '読み取り専用';
    default: return '不明';
  }
};

// Helper function to map status ID to display name
export const getStatusName = (status: SystemAdminStatus): string => {
  switch (status) {
    case 'active': return '有効';
    case 'inactive': return '無効';
    default: return '不明';
  }
};
