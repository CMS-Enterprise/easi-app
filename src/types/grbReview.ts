import { GetGRBReviewersComparisonsQuery } from 'gql/gen/graphql';

export type GRBReviewerComparisonIntake =
  GetGRBReviewersComparisonsQuery['compareGRBReviewersByIntakeID'];

export type GRBReviewerComparison =
  GRBReviewerComparisonIntake[number]['reviewers'][number];
