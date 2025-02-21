import { PersonRole } from 'gql/generated/graphql';
import i18next from 'i18next';

const contactRoles: Record<PersonRole, string> = i18next.t(
  'technicalAssistance:attendees.contactRoles',
  {
    returnObjects: true
  }
);

export default contactRoles;
