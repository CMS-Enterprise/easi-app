import {
  SystemIntakeStatusAdmin,
  SystemIntakeStatusRequester,
  TRBRequestState,
  TRBRequestStatus
} from 'types/graphql-global-types';

/**
 * Get a hash table of status enum strings and their status order.
 * Used for the request table status column sort compare fn.
 */
// Unfortunately the order of original enums from `schema.graphql` are lost
// when types are generated for the frontend in `global-types`.
// Generated enum strings are maintained in such a way here for react table column sorting.
function parseSortIndex(arr: string[]): { [v: string]: number } {
  return Object.fromEntries(arr.map((v, i) => [v, i]));
}

export const SystemIntakeStatusRequesterIndex = parseSortIndex([
  SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_NEW,
  SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_IN_PROGRESS,
  SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_SUBMITTED,
  SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_EDITS_REQUESTED,
  SystemIntakeStatusRequester.DRAFT_BUSINESS_CASE_IN_PROGRESS,
  SystemIntakeStatusRequester.DRAFT_BUSINESS_CASE_SUBMITTED,
  SystemIntakeStatusRequester.DRAFT_BUSINESS_CASE_EDITS_REQUESTED,
  SystemIntakeStatusRequester.GRT_MEETING_READY,
  SystemIntakeStatusRequester.GRT_MEETING_AWAITING_DECISION,
  SystemIntakeStatusRequester.FINAL_BUSINESS_CASE_IN_PROGRESS,
  SystemIntakeStatusRequester.FINAL_BUSINESS_CASE_SUBMITTED,
  SystemIntakeStatusRequester.FINAL_BUSINESS_CASE_EDITS_REQUESTED,
  SystemIntakeStatusRequester.GRB_MEETING_READY,
  SystemIntakeStatusRequester.GRB_MEETING_AWAITING_DECISION,
  SystemIntakeStatusRequester.LCID_ISSUED,
  SystemIntakeStatusRequester.LCID_EXPIRED,
  SystemIntakeStatusRequester.LCID_RETIRED,
  SystemIntakeStatusRequester.NOT_GOVERNANCE,
  SystemIntakeStatusRequester.NOT_APPROVED,
  SystemIntakeStatusRequester.CLOSED
]);

export const SystemIntakeStatusAdminIndex = parseSortIndex([
  SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_IN_PROGRESS,
  SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_SUBMITTED,
  SystemIntakeStatusAdmin.DRAFT_BUSINESS_CASE_IN_PROGRESS,
  SystemIntakeStatusAdmin.DRAFT_BUSINESS_CASE_SUBMITTED,
  SystemIntakeStatusAdmin.GRT_MEETING_READY,
  SystemIntakeStatusAdmin.GRT_MEETING_COMPLETE,
  SystemIntakeStatusAdmin.GRB_MEETING_READY,
  SystemIntakeStatusAdmin.GRB_MEETING_COMPLETE,
  SystemIntakeStatusAdmin.FINAL_BUSINESS_CASE_IN_PROGRESS,
  SystemIntakeStatusAdmin.FINAL_BUSINESS_CASE_SUBMITTED,
  SystemIntakeStatusAdmin.LCID_ISSUED,
  SystemIntakeStatusAdmin.LCID_EXPIRED,
  SystemIntakeStatusAdmin.LCID_RETIRED,
  SystemIntakeStatusAdmin.NOT_GOVERNANCE,
  SystemIntakeStatusAdmin.NOT_APPROVED,
  SystemIntakeStatusAdmin.CLOSED
]);

export const TRBRequestStatusIndex = parseSortIndex([
  TRBRequestStatus.NEW,
  TRBRequestStatus.DRAFT_REQUEST_FORM,
  TRBRequestStatus.REQUEST_FORM_COMPLETE,
  TRBRequestStatus.READY_FOR_CONSULT,
  TRBRequestStatus.CONSULT_SCHEDULED,
  TRBRequestStatus.CONSULT_COMPLETE,
  TRBRequestStatus.DRAFT_ADVICE_LETTER,
  TRBRequestStatus.ADVICE_LETTER_IN_REVIEW,
  TRBRequestStatus.ADVICE_LETTER_SENT,
  TRBRequestStatus.FOLLOW_UP_REQUESTED,
  TRBRequestState.CLOSED
]);

export function trbRequestStatusSortType(a: any, b: any) {
  const astatus =
    a.original.state === TRBRequestState.CLOSED
      ? a.original.state
      : a.original.status;

  const bstatus =
    b.original.state === TRBRequestState.CLOSED
      ? b.original.state
      : b.original.status;

  return TRBRequestStatusIndex[astatus] > TRBRequestStatusIndex[bstatus]
    ? 1
    : -1;
}
