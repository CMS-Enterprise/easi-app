/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTestDateInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTestDate
// ====================================================

export interface CreateTestDate_createTestDate_testDate {
  __typename: "TestDate";
  id: UUID;
}

export interface CreateTestDate_createTestDate {
  __typename: "CreateTestDatePayload";
  testDate: CreateTestDate_createTestDate_testDate | null;
}

export interface CreateTestDate {
  createTestDate: CreateTestDate_createTestDate | null;
}

export interface CreateTestDateVariables {
  input: CreateTestDateInput;
}
