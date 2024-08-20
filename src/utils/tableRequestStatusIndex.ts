import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';

export const TRBRequestStatusIndex = Object.fromEntries(
  [
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
  ].map((v, i) => [v, i])
);

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
