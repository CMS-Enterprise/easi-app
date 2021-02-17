/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Represents the availability of a document
 */
export enum AccessibilityRequestDocumentStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

/**
 * Parameters required to create an AccessibilityRequest
 */
export interface CreateAccessibilityRequestInput {
  intakeID: UUID;
  name: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
