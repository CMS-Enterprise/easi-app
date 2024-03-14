/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemIntakeContacts
// ====================================================

export interface GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts {
  __typename: "AugmentedSystemIntakeContact";
  id: UUID;
  euaUserId: string | null;
  systemIntakeId: UUID;
  component: string;
  role: string;
  commonName: string | null;
  email: string | null;
}

export interface GetSystemIntakeContacts_systemIntakeContacts {
  __typename: "SystemIntakeContactsPayload";
  systemIntakeContacts: GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts[];
}

export interface GetSystemIntakeContacts {
  systemIntakeContacts: GetSystemIntakeContacts_systemIntakeContacts;
}

export interface GetSystemIntakeContactsVariables {
  id: UUID;
}
