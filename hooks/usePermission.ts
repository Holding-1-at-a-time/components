import { useUser, useOrganization } from "@clerk/nextjs";
import { useMemo } from "react";

// Define the structure of permissions
type Permission = 
  | 'create:vehicle'
  | 'read:vehicle'
  | 'update:vehicle'
  | 'delete:vehicle'
  | 'create:appointment'
  | 'read:appointment'
  | 'update:appointment'
  | 'delete:appointment'
  | 'manage:users'
  | 'view:analytics';

// Define roles and their corresponding permissions
const rolePermissions: Record<string, Permission[]> = {
  owner: [
    'create:vehicle', 'read:vehicle', 'update:vehicle', 'delete:vehicle',
    'create:appointment', 'read:appointment', 'update:appointment', 'delete:appointment',
    'manage:users', 'view:analytics'
  ],
  admin: [
    'create:vehicle', 'read:vehicle', 'update:vehicle', 'delete:vehicle',
    'create:appointment', 'read:appointment', 'update:appointment', 'delete:appointment',
    'view:analytics'
  ],
  manager: [
    'create:vehicle', 'read:vehicle', 'update:vehicle',
    'create:appointment', 'read:appointment', 'update:appointment',
    'view:analytics'
  ],
  employee: [
    'read:vehicle',
    'create:appointment', 'read:appointment'
  ],
  client: [
    'read:vehicle',
    'create:appointment', 'read:appointment'
  ]
};

export function usePermissions() {
  const { user } = useUser();
  const { organization } = useOrganization();

  const userRole = useMemo(() => {
    if (!user || !organization) return null;
    
    const membershipData = user.organizationMemberships.find(
      membership => membership.organization.id === organization.id
    );

    return membershipData?.role ?? 'client';
  }, [user, organization]);

  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return rolePermissions[userRole]?.includes(permission) ?? false;
  };

  return { hasPermission, userRole };
}