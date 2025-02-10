import { TeamMemberRoleTypeName } from 'types/systemProfile';

/** A sort index that covers most cedar roles */
const teamRolesIndex: Record<TeamMemberRoleTypeName, number> = {
  'Business owner': 0,
  'System Maintainer': 1,
  "Contracting Officer's Representative (COR)": 2,
  'Government Task Lead (GTL)': 3,
  'Project Lead': 4,
  ISSO: 5,
  'Subject Matter Expert (SME)': 6,
  'Budget Analyst': 7,
  'Support Staff': 8,
  'Business Question Contact': 9,
  'Technical System Issues Contact': 10,
  'Data Center Contact': 11,
  'API Contact': 12,
  'AI Contact': 13
};

export default teamRolesIndex;

/** A sort index of roles for workspace team management */
export const teamManagementRolesIndex: Partial<typeof teamRolesIndex> = {
  'Business owner': 0,
  'Project Lead': 1,
  'Government Task Lead (GTL)': 2,
  "Contracting Officer's Representative (COR)": 3
};
