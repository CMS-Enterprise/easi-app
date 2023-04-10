import i18next from 'i18next';

import { PersonRole } from 'types/graphql-global-types';

const contactRoles: Record<PersonRole, string> = i18next.t(
  'technicalAssistance:attendees.contactRoles',
  {
    returnObjects: true
  }
);

export default contactRoles;
