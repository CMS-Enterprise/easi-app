/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnlinkSystemIntakeRelation
// ====================================================

export interface UnlinkSystemIntakeRelation_unlinkSystemIntakeRelation_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface UnlinkSystemIntakeRelation_unlinkSystemIntakeRelation {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: UnlinkSystemIntakeRelation_unlinkSystemIntakeRelation_systemIntake | null;
}

export interface UnlinkSystemIntakeRelation {
  unlinkSystemIntakeRelation: UnlinkSystemIntakeRelation_unlinkSystemIntakeRelation | null;
}

export interface UnlinkSystemIntakeRelationVariables {
  intakeID: UUID;
}
