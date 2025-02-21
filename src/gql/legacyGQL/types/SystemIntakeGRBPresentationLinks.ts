/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeDocumentStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: SystemIntakeGRBPresentationLinks
// ====================================================

export interface SystemIntakeGRBPresentationLinks {
  __typename: "SystemIntakeGRBPresentationLinks";
  recordingLink: string | null;
  recordingPasscode: string | null;
  transcriptFileName: string | null;
  transcriptFileStatus: SystemIntakeDocumentStatus | null;
  transcriptFileURL: string | null;
  transcriptLink: string | null;
  presentationDeckFileName: string | null;
  presentationDeckFileStatus: SystemIntakeDocumentStatus | null;
  presentationDeckFileURL: string | null;
}
