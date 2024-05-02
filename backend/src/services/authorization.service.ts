// import { AUTHORIZED_GROUPS } from '@/config';
import { Permissions, InternalRole, ADRole } from '@interfaces/users.interface';

// export function authorizeGroups(groups) {
//   const authorizedGroupsList = AUTHORIZED_GROUPS.split(',');
//   const groupsList = groups.split(',').map((g: string) => g.toLowerCase());
//   return authorizedGroupsList.some(authorizedGroup => groupsList.includes(authorizedGroup));
// }

export const defaultPermissions: () => Permissions = () => ({
  canEditSystemMessages: false,
  canViewEmployeeDetails: false,
  canViewDrafts: false,
  canEditEmployeeDetails: false,
  canEditResponsibility: false,
  canEditOperation: false,
  canEditOrganization: false,
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
      canViewEmployeeDetails: true,
      canViewDrafts: true,
      canEditEmployeeDetails: true,
      canEditResponsibility: true,
      canEditOperation: true,
      canEditOrganization: true,
      canEditOrganizationStructure: true,
      canCommentDraft: true,
    },
  ],
  [
    'meta_operator',
    {
      canViewEmployeeDetails: true,
      canViewDrafts: true,
      canEditEmployeeDetails: true,
      canEditResponsibility: true,
      canEditOperation: true,
      canEditOrganization: true,
      canEditOrganizationStructure: true,
      canCommentDraft: true,
    },
  ],
  [
    'meta_verifier',
    {
      canViewEmployeeDetails: true,
      canViewDrafts: true,
      canCommentDraft: true,
    },
  ],
  ['meta_read', {}],
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
  if (groups.length == 1) return roleADMapping[groups[0]]; // meta_read

  const roles: InternalRole[] = [];
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = roleADMapping[groupLower];
    if (role) {
      roles.push(role);
    }
  });

  return roles.sort((a, b) => (RoleOrderEnum[a] > RoleOrderEnum[b] ? 1 : 0))[0];
};
