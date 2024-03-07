import { gql } from '@apollo/client';

export const GetSystemIntakeRelationQuery = gql`
  query GetSystemIntakeRelation($id: UUID!) {
    systemIntake(id: $id) {
      id
      relationType
      contractName
      contractNumbers {
        contractNumber
      }
      systems {
        id
        name
        acronym
      }
    }
    cedarSystems {
      id
      name
    }
  }
`;

export const SetSystemIntakeRelationNewSystemQuery = gql`
  mutation SetSystemIntakeRelationNewSystem(
    $input: SetSystemIntakeRelationNewSystemInput!
  ) {
    setSystemIntakeRelationNewSystem(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;

export const SetSystemIntakeRelationExistingSystemQuery = gql`
  mutation SetSystemIntakeRelationExistingSystem(
    $input: SetSystemIntakeRelationExistingSystemInput!
  ) {
    setSystemIntakeRelationExistingSystem(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;

export const SetSystemIntakeRelationExistingServiceQuery = gql`
  mutation SetSystemIntakeRelationExistingService(
    $input: SetSystemIntakeRelationExistingServiceInput!
  ) {
    setSystemIntakeRelationExistingService(input: $input) {
      systemIntake {
        id
      }
    }
  }
`;

export const UnlinkSystemIntakeRelationQuery = gql`
  mutation UnlinkSystemIntakeRelation($intakeID: UUID!) {
    unlinkSystemIntakeRelation(intakeID: $intakeID) {
      systemIntake {
        id
      }
    }
  }
`;
