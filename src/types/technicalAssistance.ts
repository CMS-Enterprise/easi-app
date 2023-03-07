import React from 'react';

import { GetTrbAdviceLetter_trbRequest_adviceLetter as AdviceLetter } from 'queries/types/GetTrbAdviceLetter';
import { StepSubmit } from 'views/TechnicalAssistance/RequestForm';

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

export type AdviceLetterRecommendationFields = {
  id?: string;
  title: string;
  recommendation: string;
  /** Links array - object type to get useFieldArray hook to work */
  links?: { link: string }[];
};

export type AdviceLetterSummary = {
  meetingSummary: string | null;
};

export type AdviceLetterNextSteps = {
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  followupPoint: string | null;
};

/** Advice letter form fields */
export type AdviceLetterFormFields = {
  meetingSummary: string | null;
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  followupPoint: string | null;
  // recommendations: AdviceLetterRecommendationFields[];
  // internalReview: string;
  // review: string;
};

export type UpdateAdviceLetterType = (
  fields?: (keyof AdviceLetterFormFields)[],
  redirectUrl?: string
) => Promise<void>;

export type FormAlertObject = {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
};

export type StepComponentProps = {
  trbRequestId: string;
  adviceLetter: AdviceLetter;
  /**
   * Set the current form step component submit handler
   * so that in can be used in other places like the header.
   * Form step components need to reassign the handler.
   */
  setStepSubmit: React.Dispatch<React.SetStateAction<StepSubmit | null>>;
  /** Set to update the submitting state from step components to the parent request form */
  setIsStepSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  /** Set a form level alert message from within step components */
  setFormAlert: React.Dispatch<React.SetStateAction<FormAlertObject | null>>;
};
