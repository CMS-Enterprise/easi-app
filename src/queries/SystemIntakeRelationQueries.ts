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

export const GetTrbRequestRelationQuery = gql`
  query GetTrbRequestRelation($id: UUID!) {
    trbRequest(id: $id) {
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
export const SetTrbRequestRelationNewSystemQuery = gql`
  mutation SetTrbRequestRelationNewSystem(
    $input: SetTRBRequestRelationNewSystemInput!
  ) {
    setTRBRequestRelationNewSystem(input: $input) {
      id
    }
  }
`;

export const SetTrbRequestRelationExistingSystemQuery = gql`
  mutation SetTrbRequestRelationExistingSystem(
    $input: SetTRBRequestRelationExistingSystemInput!
  ) {
    setTRBRequestRelationExistingSystem(input: $input) {
      id
    }
  }
`;

export const SetTrbRequestRelationExistingServiceQuery = gql`
  mutation SetTrbRequestRelationExistingService(
    $input: SetTRBRequestRelationExistingServiceInput!
  ) {
    setTRBRequestRelationExistingService(input: $input) {
      id
    }
  }
`;

export const UnlinkTrbRequestRelationQuery = gql`
  mutation UnlinkTrbRequestRelation($trbRequestID: UUID!) {
    unlinkTRBRequestRelation(trbRequestID: $trbRequestID) {
      id
    }
  }
`;
