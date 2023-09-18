/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarContacts
// ====================================================

export interface GetCedarContacts_cedarPersonsByCommonName {
  __typename: "UserInfo";
  commonName: string;
  email: EmailAddress;
  euaUserId: string;
}

export interface GetCedarContacts {
  cedarPersonsByCommonName: GetCedarContacts_cedarPersonsByCommonName[];
}

export interface GetCedarContactsVariables {
  commonName: string;
}
