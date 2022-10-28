import { PersonRole } from './graphql-global-types';

export type AttendeeFormFields = {
  id?: string;
  trbRequestId: string;
  userInfo: {
    commonName: string;
    euaUserId: string;
    email?: string;
  } | null;
  component: string;
  role: PersonRole | null;
};
