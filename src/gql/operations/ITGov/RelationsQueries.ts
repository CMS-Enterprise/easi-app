import { gql } from '@apollo/client';

export const SetSystemIntakeRelationNewSystem = gql(/* GraphQL */ `
  mutation SetSystemIntakeRelationNewSystem(
    $input: SetSystemIntakeRelationNewSystemInput!
  ) {
    setSystemIntakeRelationNewSystem(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);

export const SetSystemIntakeRelationExistingSystem = gql(/* GraphQL */ `
  mutation SetSystemIntakeRelationExistingSystem(
    $input: SetSystemIntakeRelationExistingSystemInput!
  ) {
    setSystemIntakeRelationExistingSystem(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);

export const SetSystemIntakeRelationExistingService = gql(/* GraphQL */ `
  mutation SetSystemIntakeRelationExistingService(
    $input: SetSystemIntakeRelationExistingServiceInput!
  ) {
    setSystemIntakeRelationExistingService(input: $input) {
      systemIntake {
        id
      }
    }
  }
`);

export const UnlinkSystemIntakeRelation = gql(/* GraphQL */ `
  mutation UnlinkSystemIntakeRelation($intakeID: UUID!) {
    unlinkSystemIntakeRelation(intakeID: $intakeID) {
      systemIntake {
        id
      }
    }
  }
`);

export const SetTrbRequestRelationNewSystem = gql(/* GraphQL */ `
  mutation SetTrbRequestRelationNewSystem(
    $input: SetTRBRequestRelationNewSystemInput!
  ) {
    setTRBRequestRelationNewSystem(input: $input) {
      id
    }
  }
`);

export const SetTrbRequestRelationExistingSystem = gql(/* GraphQL */ `
  mutation SetTrbRequestRelationExistingSystem(
    $input: SetTRBRequestRelationExistingSystemInput!
  ) {
    setTRBRequestRelationExistingSystem(input: $input) {
      id
    }
  }
`);

export const SetTrbRequestRelationExistingService = gql(/* GraphQL */ `
  mutation SetTrbRequestRelationExistingService(
    $input: SetTRBRequestRelationExistingServiceInput!
  ) {
    setTRBRequestRelationExistingService(input: $input) {
      id
    }
  }
`);

export const UnlinkTrbRequestRelation = gql(/* GraphQL */ `
  mutation UnlinkTrbRequestRelation($trbRequestID: UUID!) {
    unlinkTRBRequestRelation(trbRequestID: $trbRequestID) {
      id
    }
  }
`);
