/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemIntakeContactsQuery
// ====================================================

export interface GetSystemIntakeContactsQuery_systemIntakeContacts_systemIntakeContacts {
  __typename: "AugmentedSystemIntakeContact";
  systemIntakeId: UUID;
  id: UUID;
  euaUserId: string;
  component: string;
  role: string;
  commonName: string | null;
  email: EmailAddress | null;
}

export interface GetSystemIntakeContactsQuery_systemIntakeContacts {
  __typename: "SystemIntakeContactsPayload";
  systemIntakeContacts: GetSystemIntakeContactsQuery_systemIntakeContacts_systemIntakeContacts[];
}

export interface GetSystemIntakeContactsQuery {
  systemIntakeContacts: GetSystemIntakeContactsQuery_systemIntakeContacts;
}

export interface GetSystemIntakeContactsQueryVariables {
  id: UUID;
}
