/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteTestDateInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteTestDate
// ====================================================

export interface DeleteTestDate_deleteTestDate_testDate {
  __typename: "TestDate";
  id: UUID;
}

export interface DeleteTestDate_deleteTestDate {
  __typename: "DeleteTestDatePayload";
  testDate: DeleteTestDate_deleteTestDate_testDate | null;
}

export interface DeleteTestDate {
  deleteTestDate: DeleteTestDate_deleteTestDate | null;
}

export interface DeleteTestDateVariables {
  input: DeleteTestDateInput;
}
