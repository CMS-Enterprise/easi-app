import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';

import { TRBRequestContext } from '../../RequestContext';

// eslint-disable-next-line no-shadow
enum TrbRequestClosed {
  REQUEST_CLOSED = 'REQUEST_CLOSED'
}

export type TrbAdminActionStatus =
  | TrbRequestClosed
  | Exclude<
      TRBRequestStatus,
      'NEW' | 'DRAFT_REQUEST_FORM' | 'FOLLOW_UP_REQUESTED'
    >;

type AdminActionButton = {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  outline?: boolean;
};

// type AdminSubpageKeys =
//   | 'request'
//   | 'initial-request-form'
//   | 'documents'
//   | 'feedback'
//   | 'advice'
//   | 'notes';

const buttons = {
  REQUEST_FORM_COMPLETE: {
    request: [
      {
        label: 'View request form',
        onClick: () => null
      }
    ],
    'initial-request-form': [
      {
        label: 'Request edits',
        onClick: () => null,
        outline: true
      },
      {
        label: 'Ready for consult',
        onClick: () => null
      }
    ]
  }
  // READY_FOR_CONSULT: {},
  // CONSULT_SCHEDULED: {},
  // CONSULT_COMPLETE: {},
  // DRAFT_ADVICE_LETTER: {},
  // ADVICE_LETTER_IN_REVIEW: {},
  // ADVICE_LETTER_SENT: {},
  // REQUEST_CLOSED: {}
};

type statusObject = {
  title: string;
  description: string;
  buttons: { [index: string]: AdminActionButton[] };
  children?: React.ReactNode;
  showCloseRequest?: boolean;
};

const useAdminActionStatus = (): statusObject | undefined => {
  const { t } = useTranslation('technicalAssistance');

  const { data } = useContext(TRBRequestContext);

  /** Current admin action status */
  const status = useMemo(() => {
    // If request is closed, return status
    if (data?.trbRequest?.state === TRBRequestState.CLOSED) {
      return 'REQUEST_CLOSED';
    }

    // If no status, return undefined
    if (!data?.trbRequest?.status) return undefined;

    // If status does not require admin action, return undefined
    if (
      [
        TRBRequestStatus.NEW,
        TRBRequestStatus.DRAFT_REQUEST_FORM,
        TRBRequestStatus.FOLLOW_UP_REQUESTED
      ].includes(data?.trbRequest?.status)
    ) {
      return undefined;
    }

    return data?.trbRequest?.status;
  }, [data]);

  if (!status) return undefined;

  return {
    title: t(`adminAction.statuses.${status}.title`),
    description: t(`adminAction.statuses.${status}.description`),
    buttons: buttons[status as keyof typeof buttons],
    showCloseRequest: true
  };
};

export default useAdminActionStatus;
