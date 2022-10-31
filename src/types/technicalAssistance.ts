import { PersonRole } from './graphql-global-types';

export type AttendeeUserInfo = {
  commonName: string;
  euaUserId: string;
  email?: string;
} | null;

/** TRB attendee fields allows null role in form */
export type TRBAttendeeFields = {
  id?: string;
  trbRequestId: string;
  userInfo: AttendeeUserInfo;
  component: string;
  role: PersonRole | null;
};
