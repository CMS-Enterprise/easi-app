/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrbRequestConsultMeeting
// ====================================================

export interface GetTrbRequestConsultMeeting_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  consultMeetingTime: Time | null;
}

export interface GetTrbRequestConsultMeeting {
  trbRequest: GetTrbRequestConsultMeeting_trbRequest;
}

export interface GetTrbRequestConsultMeetingVariables {
  id: UUID;
}
