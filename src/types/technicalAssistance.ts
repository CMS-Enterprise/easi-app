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

/** TRB Admin page */
export type TrbAdminPageProps = {
  trbRequestId: string;
};

export type TrbAdminPage = (props: TrbAdminPageProps) => JSX.Element;

/** Subnav item return type for admin home wrapper */
export type SubNavItem = {
  /** Route to use for navigation link */
  route: string;
  /** Translation key to use for navigation link text */
  text: string;
  /** Component to display on page */
  component: TrbAdminPage;
  /**
   * Whether or not the navigation item is last in a group.
   * If true, border is shown beneath link.
   */
  groupEnd?: boolean;
};
