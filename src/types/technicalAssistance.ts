import { PersonRole } from './graphql-global-types';

/** TRB attendee fields allows null role in form */
export type TRBAttendeeFields = {
  euaUserId: string;
  component: string | null;
  role: PersonRole | null;
};

/** Field labels */
export type AttendeeFieldLabels = {
  euaUserId: string;
  component: string;
  role: string;
  submit?: string;
};

/** TRB Attendee user info */
export type TRBAttendeeUserInfo = {
  commonName: string;
  euaUserId: string;
  email?: string;
} | null;

/** TRB Attendee object with user info */
export type TRBAttendeeData = {
  id?: string;
  trbRequestId: string;
  userInfo: TRBAttendeeUserInfo;
  component: string;
  role: PersonRole | null;
};

/** Formatted attendees for display */
export type FormattedTRBAttendees = {
  requester: TRBAttendeeData;
  attendees: TRBAttendeeData[];
};

/** TRB Admin page props */
export type TrbAdminPageProps = {
  trbRequestId: string;
};

/** Subnav item return type for admin home wrapper */
export type SubNavItem = {
  /** Route to use for navigation link */
  route: string;
  /** Translation key to use for navigation link text */
  text: string;
  /** Component to display on page */
  component: ({ trbRequestId }: TrbAdminPageProps) => JSX.Element;
  /**
   * Whether or not the navigation item is last in a group.
   * If true, border is shown beneath link.
   */
  groupEnd?: boolean;
};
