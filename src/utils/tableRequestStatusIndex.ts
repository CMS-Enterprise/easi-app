import {
  SystemIntakeStatusAdmin,
  SystemIntakeStatusRequester,
  TRBRequestStatus
} from 'gql/generated/graphql';

import { TRBRequestState } from 'types/graphql-global-types';

/**
 * Hash tables of status enum strings and their status order.
 * Used for the request table status column sort compare fn.
 */
// Unfortunately the order of original enums from `schema.graphql` are lost
// when types are generated for the frontend in `global-types`.
// Generated enum strings are maintained in such a way here for react table column sorting.
/*
Produce sort index objects with something like this:

  function parseSortIndex(arr) {
    return Object.fromEntries(arr.map((v, i) => [v, i]));
  }

Input
[
 SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_NEW,
 SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_IN_PROGRESS,
 SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_SUBMITTED,
]

Output
{
  INITIAL_REQUEST_FORM_NEW: 0,
  INITIAL_REQUEST_FORM_IN_PROGRESS: 1,
  INITIAL_REQUEST_FORM_SUBMITTED: 2,
}

*/

export const SystemIntakeStatusRequesterIndex: Record<
  SystemIntakeStatusRequester,
  number
> = {
  INITIAL_REQUEST_FORM_NEW: 0,
  INITIAL_REQUEST_FORM_IN_PROGRESS: 1,
  INITIAL_REQUEST_FORM_SUBMITTED: 2,
  INITIAL_REQUEST_FORM_EDITS_REQUESTED: 3,
  DRAFT_BUSINESS_CASE_IN_PROGRESS: 4,
  DRAFT_BUSINESS_CASE_SUBMITTED: 5,
  DRAFT_BUSINESS_CASE_EDITS_REQUESTED: 6,
  GRT_MEETING_READY: 7,
  GRT_MEETING_AWAITING_DECISION: 8,
  FINAL_BUSINESS_CASE_IN_PROGRESS: 9,
  FINAL_BUSINESS_CASE_SUBMITTED: 10,
  FINAL_BUSINESS_CASE_EDITS_REQUESTED: 11,
  GRB_MEETING_READY: 12,
  GRB_MEETING_AWAITING_DECISION: 13,
  GRB_REVIEW_IN_PROGRESS: 14,
  LCID_ISSUED: 15,
  LCID_EXPIRED: 16,
  LCID_RETIRED: 17,
  NOT_GOVERNANCE: 18,
  NOT_APPROVED: 19,
  CLOSED: 20
} as const;

export const SystemIntakeStatusAdminIndex: Record<
  SystemIntakeStatusAdmin,
  number
> = {
  INITIAL_REQUEST_FORM_IN_PROGRESS: 0,
  INITIAL_REQUEST_FORM_SUBMITTED: 1,
  DRAFT_BUSINESS_CASE_IN_PROGRESS: 2,
  DRAFT_BUSINESS_CASE_SUBMITTED: 3,
  GRT_MEETING_READY: 4,
  GRT_MEETING_COMPLETE: 5,
  GRB_MEETING_READY: 6,
  GRB_MEETING_COMPLETE: 7,
  GRB_REVIEW_IN_PROGRESS: 8,
  FINAL_BUSINESS_CASE_IN_PROGRESS: 9,
  FINAL_BUSINESS_CASE_SUBMITTED: 10,
  LCID_ISSUED: 11,
  LCID_EXPIRED: 12,
  LCID_RETIRED: 13,
  NOT_GOVERNANCE: 14,
  NOT_APPROVED: 15,
  CLOSED: 16
} as const;

// Adding 'OPEN' status for typescript, but will never be needed in trbRequestStatusSortType
export const TRBRequestStatusIndex: Record<
  TRBRequestStatus | TRBRequestState,
  number
> = {
  NEW: 0,
  DRAFT_REQUEST_FORM: 1,
  REQUEST_FORM_COMPLETE: 2,
  READY_FOR_CONSULT: 3,
  CONSULT_SCHEDULED: 4,
  CONSULT_COMPLETE: 5,
  DRAFT_GUIDANCE_LETTER: 6,
  GUIDANCE_LETTER_IN_REVIEW: 7,
  GUIDANCE_LETTER_SENT: 8,
  FOLLOW_UP_REQUESTED: 9,
  CLOSED: 10,
  OPEN: 11
} as const;

export type SortTRBInput = {
  original: { status: TRBRequestStatus; state: TRBRequestState };
};

export function trbRequestStatusSortType(a: SortTRBInput, b: SortTRBInput) {
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
