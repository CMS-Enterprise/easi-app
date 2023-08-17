/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemIntakeDocumentUrls
// ====================================================

export interface GetSystemIntakeDocumentUrls_systemIntake_documents {
  __typename: "SystemIntakeDocument";
  id: UUID;
  url: string;
  fileName: string;
}

export interface GetSystemIntakeDocumentUrls_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  documents: GetSystemIntakeDocumentUrls_systemIntake_documents[];
}

export interface GetSystemIntakeDocumentUrls {
  systemIntake: GetSystemIntakeDocumentUrls_systemIntake | null;
}

export interface GetSystemIntakeDocumentUrlsVariables {
  id: UUID;
}
