/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RemoveTestDateInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: RemoveTestDate
// ====================================================

export interface RemoveTestDate_removeTestDate_testDate {
  __typename: "TestDate";
  id: UUID;
}

export interface RemoveTestDate_removeTestDate {
  __typename: "RemoveTestDatePayload";
  testDate: RemoveTestDate_removeTestDate_testDate | null;
}

export interface RemoveTestDate {
  removeTestDate: RemoveTestDate_removeTestDate | null;
}

export interface RemoveTestDateVariables {
  input: RemoveTestDateInput;
}
