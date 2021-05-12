/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTestDateInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTestDate
// ====================================================

export interface UpdateTestDate_updateTestDate_testDate {
  __typename: "TestDate";
  id: UUID;
}

export interface UpdateTestDate_updateTestDate {
  __typename: "UpdateTestDatePayload";
  testDate: UpdateTestDate_updateTestDate_testDate | null;
}

export interface UpdateTestDate {
  updateTestDate: UpdateTestDate_updateTestDate | null;
}

export interface UpdateTestDateVariables {
  input: UpdateTestDateInput;
}
