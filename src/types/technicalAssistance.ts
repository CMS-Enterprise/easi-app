import React from 'react';
import { ModalRef } from '@trussworks/react-uswds';
import {
  TRBGuidanceLetterFragment,
  TRBGuidanceLetterRecommendationCategory
} from 'gql/gen/graphql';

import { GetTrbRequestSummary_trbRequest as TrbRequestSummary } from 'queries/types/GetTrbRequestSummary';
import { StepSubmit } from 'views/TechnicalAssistance/RequestForm';

import { PersonRole, TRBGuidanceLetterStatus } from './graphql-global-types';

/* eslint-disable camelcase */
export type { GetTrbAdminTeamHome_trbRequests as TrbAdminTeamHomeRequest } from 'queries/types/GetTrbAdminTeamHome';
export type { GetTrbRequestFeedback_trbRequest_feedback as TrbRequestFeedback } from 'queries/types/GetTrbRequestFeedback';
/* eslint-enable camelcase */

/** TRB attendee fields allows null role in form */
export type TRBAttendeeFields = {
  euaUserId: string | null;
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
  euaUserId: string | null;
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

export type TrbRequestIdRef = string | null;

interface TrbAdminDefaultProps {
  trbRequestId: string;
  trbRequest: TrbRequestSummary;
  assignLeadModalRef: React.RefObject<ModalRef>;
  assignLeadModalTrbRequestIdRef: React.MutableRefObject<TrbRequestIdRef>;
  requesterString?: string | null;
}
export interface TrbAdminPageProps extends TrbAdminDefaultProps {}

export type TrbAdminPath =
  | 'request'
  | 'initial-request-form'
  | 'documents'
  | 'feedback'
  | 'guidance'
  | 'additional-information'
  | 'notes';

export type GuidanceFormStepKey =
  | 'summary'
  | 'insights'
  | 'next-steps'
  | 'internal-review'
  | 'review';

export type TrbAdminPage = {
  /** Label translation key */
  text: string;
  /** Path to use for navigation link */
  path: TrbAdminPath;
  /** Component to display on page */
  component: ({ trbRequest }: TrbAdminPageProps) => JSX.Element;
  /**
   * Whether or not the navigation item is last in a group.
   * If true, border is shown beneath link.
   */
  groupEnd?: boolean;
};

export type GuidanceLetterInsightFields = {
  id?: string;
  title: string;
  recommendation: string;
  category: TRBGuidanceLetterRecommendationCategory;
  /** Links array - object type to get useFieldArray hook to work */
  links?: { link: string }[];
};

export type GuidanceLetterSummary = {
  meetingSummary: string | null;
};

export type GuidanceLetterNextSteps = {
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  followupPoint: string | null;
};

export type FormAlertObject = {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
};

export type StepComponentProps = {
  trbRequestId: string;
  guidanceLetter: TRBGuidanceLetterFragment;
  guidanceLetterStatus: TRBGuidanceLetterStatus;
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
  stepsCompleted?: GuidanceFormStepKey[] | undefined;
  setStepsCompleted?: React.Dispatch<
    React.SetStateAction<GuidanceFormStepKey[] | undefined>
  >;
};

export interface TrbRecipientFields {
  notifyEuaIds: string[];
  copyTrbMailbox: boolean;
}

// Funding sources types

/** Funding sources formatted for form */
export type MultiFundingSource = {
  fundingNumber: string;
  sources: string[];
};

/** Funding sources formatted for form */
export interface ExistingFundingSource extends MultiFundingSource {
  initialFundingNumber: string;
}

/** Add, edit, or delete funding source */
export type UpdateFundingSources =
  | {
      action: 'Add' | 'Delete';
      data: MultiFundingSource;
    }
  | {
      action: 'Edit';
      data: ExistingFundingSource;
    };

/** Update active funding source in form */
export type UpdateActiveFundingSource = {
  action: 'Add' | 'Edit' | null;
  data?: MultiFundingSource;
};

/** Funding sources object formatted for display */
export type FormattedFundingSourcesObject = {
  [number: string]: {
    fundingNumber: string;
    sources: string[];
  };
};
