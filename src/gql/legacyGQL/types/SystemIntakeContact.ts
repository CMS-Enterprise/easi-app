/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SystemIntakeContact
// ====================================================

export interface SystemIntakeContact {
  __typename: "AugmentedSystemIntakeContact";
  systemIntakeId: UUID;
  id: UUID;
  euaUserId: string;
  component: string;
  role: string;
  commonName: string | null;
  email: EmailAddress | null;
}
