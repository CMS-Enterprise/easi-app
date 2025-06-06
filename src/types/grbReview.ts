import {
  GetGRBReviewersComparisonsQuery,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewStandardStatusType
} from 'gql/generated/graphql';

import { grbReviewFormSteps } from 'i18n/en-US/grbReview';

export type GRBReviewFormAction = 'add' | 'edit' | 'remove';

export type GRBReviewerFields = {
  userAccount: {
    username: string;
    commonName: string;
    email: string;
  };
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
};

export type GRBReviewerComparisonIntake =
  GetGRBReviewersComparisonsQuery['compareGRBReviewersByIntakeID'];

export type GRBReviewerComparison =
  GRBReviewerComparisonIntake[number]['reviewers'][number];

export interface GRBReviewFormStepProps {
  grbReview: SystemIntakeGRBReviewFragment;
}

export type GrbReviewFormStepKey = (typeof grbReviewFormSteps)[number]['key'];

export type GRBReviewStatus =
  | SystemIntakeGRBReviewAsyncStatusType
  | SystemIntakeGRBReviewStandardStatusType;
