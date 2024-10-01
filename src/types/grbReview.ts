import {
  GetGRBReviewersComparisonsQuery,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/gen/graphql';

export type GRBReviewerFormFields = {
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
