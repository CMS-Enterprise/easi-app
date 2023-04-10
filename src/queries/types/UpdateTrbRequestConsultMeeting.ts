/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestConsultMeetingTimeInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestConsultMeeting
// ====================================================

export interface UpdateTrbRequestConsultMeeting_updateTRBRequestConsultMeetingTime {
  __typename: "TRBRequest";
  id: UUID;
  consultMeetingTime: Time | null;
}

export interface UpdateTrbRequestConsultMeeting {
  updateTRBRequestConsultMeetingTime: UpdateTrbRequestConsultMeeting_updateTRBRequestConsultMeetingTime;
}

export interface UpdateTrbRequestConsultMeetingVariables {
  input: UpdateTRBRequestConsultMeetingTimeInput;
}
