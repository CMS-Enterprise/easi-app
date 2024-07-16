import { gql } from '@apollo/client';

export const SystemIntakeGRBReviewer = gql`
  fragment SystemIntakeGRBReviewer on SystemIntakeGRBReviewer {
    id
    userAccount {
      id
      username
    }
  }
`;

export const GetSystemIntakeGRBReviewersQuery = gql`
  ${SystemIntakeGRBReviewer}
  query GetSystemIntakeGRBReviewers($id: UUID!) {
    systemIntake(id: $id) {
      id
      grbReviewers {
        ...SystemIntakeGRBReviewer
      }
    }
  }
`;

export const CreateSystemIntakeGRBReviewerQuery = gql`
  mutation CreateSystemIntakeGRBReviewer(
    $input: CreateSystemIntakeGRBReviewerInput!
  ) {
    createSystemIntakeGRBReviewer(input: $input) {
      id
    }
  }
`;

export const UpdateSystemIntakeGRBReviewerQuery = gql`
  mutation UpdateSystemIntakeGRBReviewer(
    $input: UpdateSystemIntakeGRBReviewerInput!
  ) {
    updateSystemIntakeGRBReviewer(input: $input) {
      id
    }
  }
`;

export const DeleteSystemIntakeGRBReviewerQuery = gql`
  mutation DeleteSystemIntakeGRBReviewer(
    $input: DeleteSystemIntakeGRBReviewerInput!
  ) {
    deleteSystemIntakeGRBReviewer(input: $input)
  }
`;
