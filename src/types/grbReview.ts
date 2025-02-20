import {
  GetGRBReviewersComparisonsQuery,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';

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
