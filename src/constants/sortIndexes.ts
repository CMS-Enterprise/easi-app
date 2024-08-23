import { parseSortIndex } from 'utils/tableRequestStatusIndex';

// eslint-disable-next-line import/prefer-default-export
export const rolesIndex = parseSortIndex([
  'Business Owner',
  'System Maintainer',
  "Contracting Officer's Representative (COR)",
  'Government Task Lead (GTL)',
  'Project Lead',
  // 'Information System Security Officer (ISSO)',
  'ISSO',
  'Subject Matter Expert (SME)',
  'Budget Analyst',
  'Support Staff',
  'Business Question Contact',
  'Technical System Issues Contact',
  'Data Center Contact',
  'API Contact',
  'AI Contact'
]);
