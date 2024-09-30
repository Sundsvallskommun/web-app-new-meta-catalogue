// import { AUTHORIZED_GROUPS } from '@/config';
import { Permissions, InternalRole, ADRole } from '@interfaces/users.interface';

// export function authorizeGroups(groups) {
//   const authorizedGroupsList = AUTHORIZED_GROUPS.split(',');
//   const groupsList = groups.split(',').map((g: string) => g.toLowerCase());
//   return authorizedGroupsList.some(authorizedGroup => groupsList.includes(authorizedGroup));
// }

export const defaultPermissions: () => Permissions = () => ({
  canEditSystemMessages: false,
  canViewEmployees: false,
  canViewEmployeeDetails: false,
  canEditEmployeeDetails: false,
  canViewResponsibility: false,
  canEditResponsibility: false,
  canViewOperation: false,
  canEditOperation: false,
  canEditOrganization: false,
  canViewDrafts: false,
  canEditDrafts: false,
  canEditOrganizationStructure: false,
  canCommentDraft: false,
});

enum RoleOrderEnum {
  'meta_read',
  'meta_verifier',
  'meta_operator',
  'meta_admin',
}

const roles = new Map<InternalRole, Partial<Permissions>>([
  [
    'meta_admin',
    {
      canEditSystemMessages: true,
      canViewEmployees: true,
      canViewEmployeeDetails: true,
      canEditEmployeeDetails: true,
      canViewResponsibility: true,
      canEditResponsibility: true,
      canViewOperation: true,
      canEditOperation: true,
      canEditOrganization: true,
      canViewDrafts: true,
      canEditDrafts: true,
      canEditOrganizationStructure: true,
      canCommentDraft: true,
    },
  ],
  [
    'meta_operator',
    {
      canEditSystemMessages: false,
      canViewEmployees: true,
      canViewEmployeeDetails: true,
      canEditEmployeeDetails: true,
      canViewResponsibility: true,
      canEditResponsibility: true,
      canViewOperation: true,
      canEditOperation: true,
      canEditOrganization: true,
      canViewDrafts: true,
      canEditDrafts: false,
      canEditOrganizationStructure: true,
      canCommentDraft: true,
    },
  ],
  [
    'meta_verifier',
    {
      canEditSystemMessages: false,
      canViewEmployees: true,
      canViewEmployeeDetails: true,
      canEditEmployeeDetails: false,
      canViewResponsibility: true,
      canEditResponsibility: false,
      canViewOperation: true,
      canEditOperation: false,
      canEditOrganization: false,
      canViewDrafts: true,
      canEditDrafts: false,
      canEditOrganizationStructure: false,
      canCommentDraft: true,
    },
  ],
  [
    'meta_read',
    {
      canEditSystemMessages: false,
      canViewEmployees: true,
      canViewEmployeeDetails: false,
      canEditEmployeeDetails: false,
      canViewResponsibility: false,
      canEditResponsibility: false,
      canViewOperation: false,
      canEditOperation: false,
      canEditOrganization: false,
      canViewDrafts: false,
      canEditDrafts: false,
      canEditOrganizationStructure: false,
      canCommentDraft: false,
    },
  ],
]);

type RoleADMapping = {
  [key in ADRole]: InternalRole;
};
const roleADMapping: RoleADMapping = {
  sg_appl_meta_masterdata_admin: 'meta_admin',
  sg_appl_meta_masterdata_operator: 'meta_operator',
  sg_appl_meta_masterdata_verifier: 'meta_verifier',
  sg_appl_meta_masterdata_read: 'meta_read',
};

/**
 *
 * @param groups Array of groups/roles
 * @param internalGroups Whether to use internal groups or external group-mappings
 * @returns collected permissions for all matching role groups
 */
export const getPermissions = (groups: InternalRole[] | ADRole[], internalGroups = false): Permissions => {
  const permissions: Permissions = defaultPermissions();
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = internalGroups ? (groupLower as InternalRole) : (roleADMapping[groupLower] as InternalRole);
    if (roles.has(role)) {
      const groupPermissions = roles.get(role);
      Object.keys(groupPermissions).forEach(permission => {
        if (groupPermissions[permission] === true) {
          permissions[permission] = true;
        }
      });
    }
  });
  return permissions;
};

/**
 * Ensures to return only the role with most permissions
 * @param groups List of AD roles
 * @returns role with most permissions
 */
export const getRole = (groups: ADRole[]) => {
  const roles: InternalRole[] = [];
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = roleADMapping[groupLower];
    if (role) {
      roles.push(role);
    }
  });

  return roles.sort((a, b) => RoleOrderEnum[b] - RoleOrderEnum[a])[0];
};
