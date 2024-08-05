import { gql } from '@apollo/client';

export const SystemIntakeGRBReviewer = gql`
  fragment SystemIntakeGRBReviewer on SystemIntakeGRBReviewer {
    id
    votingRole
    grbRole
    userAccount {
      id
      username
      commonName
      email
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
  ${SystemIntakeGRBReviewer}
  mutation CreateSystemIntakeGRBReviewer(
    $input: CreateSystemIntakeGRBReviewerInput!
  ) {
    createSystemIntakeGRBReviewer(input: $input) {
      ...SystemIntakeGRBReviewer
    }
  }
`;

export const UpdateSystemIntakeGRBReviewerQuery = gql`
  ${SystemIntakeGRBReviewer}
  mutation UpdateSystemIntakeGRBReviewer(
    $input: UpdateSystemIntakeGRBReviewerInput!
  ) {
    updateSystemIntakeGRBReviewer(input: $input) {
      ...SystemIntakeGRBReviewer
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
