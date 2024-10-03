import { parseSortIndex } from 'utils/tableRequestStatusIndex';

// This role list is slightly different from types/systemProfile.ts#RoleTypeName
// RoleTypeName also wasn't initially intended to be an ordered list
const teamCardRolesIndex = parseSortIndex([
  'Business Owner',
  'System Maintainer',
  "Contracting Officer's Representative (COR)",
  'Government Task Lead (GTL)',
  'Project Lead',

  // 'Information System Security Officer (ISSO)',
  'ISSO', // As from cedar api

  'Subject Matter Expert (SME)',
  'Budget Analyst',
  'Support Staff',
  'Business Question Contact',
  'Technical System Issues Contact',
  'Data Center Contact',
  'API Contact',
  'AI Contact'
]);

export default teamCardRolesIndex;
