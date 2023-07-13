import React, { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ModalRef } from '@trussworks/react-uswds';

import { AdminActionButton } from 'components/shared/AdminAction';
import { CreateTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  CreateTrbAdviceLetter,
  CreateTrbAdviceLetterVariables
} from 'queries/types/CreateTrbAdviceLetter';
import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import { TrbAdminPath, TrbRequestIdRef } from 'types/technicalAssistance';

import { TRBRequestContext } from '../../RequestContext';

type ActionButtonsProps = {
  trbRequestId: string;
  activePage: TrbAdminPath;
  status: TRBRequestStatus | undefined;
  state: TRBRequestState | undefined;
  assignLeadModalRef: React.RefObject<ModalRef> | undefined;
  assignLeadModalTrbRequestIdRef:
    | React.MutableRefObject<TrbRequestIdRef>
    | undefined;
  openNotes: Dispatch<SetStateAction<boolean>>;
};

type ActionButtonKey =
  | 'orCloseRequest'
  | 'orCloseRequestWithoutSending'
  | 'closeRequest'
  | 'reopenRequest'
  | 'viewRequestForm'
  | 'requestEdits'
  | 'readyForConsult'
  | 'addDateTime'
  | 'assignTrbLead'
  | 'viewSupportingDocuments'
  | 'viewAdviceLetter'
  | 'startAdviceLetter'
  | 'continueAdviceLetter'
  | 'finalizeAdviceLetter'
  | 'addNote';

const useTrbAdminActionButtons = ({
  trbRequestId,
  activePage,
  status,
  state,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef,
  openNotes
}: ActionButtonsProps): AdminActionButton[] => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const trbContextData = useContext(TRBRequestContext);

  const leadAssigned = !!trbContextData.data?.trbRequest?.trbLeadInfo
    ?.commonName;

  const [createAdviceLetter] = useMutation<
    CreateTrbAdviceLetter,
    CreateTrbAdviceLetterVariables
  >(CreateTrbAdviceLetterQuery, {
    variables: {
      trbRequestId
    }
  });

  const actionButtons: AdminActionButton[] = useMemo(() => {
    const buttons: Record<ActionButtonKey, AdminActionButton> = {
      orCloseRequest: {
        label: t('adminAction.buttons.orCloseRequest'),
        link: `/trb/${trbRequestId}/request/close-request`,
        unstyled: true
      },
      orCloseRequestWithoutSending: {
        label: t('adminAction.buttons.orCloseRequestWithoutSending'),
        link: `/trb/${trbRequestId}/request/close-request`,
        unstyled: true
      },
      closeRequest: {
        label: t('adminAction.buttons.closeRequest'),
        link: `/trb/${trbRequestId}/request/close-request`
      },
      reopenRequest: {
        label: t('adminAction.buttons.reopenRequest'),
        link: `/trb/${trbRequestId}/request/reopen-request`
      },
      viewRequestForm: {
        label: t('adminAction.buttons.viewRequestForm'),
        link: `/trb/${trbRequestId}/initial-request-form`
      },
      requestEdits: {
        label: t('adminAction.buttons.requestEdits'),
        link: `/trb/${trbRequestId}/initial-request-form/request-edits`
      },
      readyForConsult: {
        label: t('adminAction.buttons.readyForConsult'),
        link: `/trb/${trbRequestId}/initial-request-form/ready-for-consult`
      },
      addDateTime: {
        label: t('adminAction.buttons.addDateTime'),
        link: `/trb/${trbRequestId}/initial-request-form/schedule-consult`
      },
      assignTrbLead: {
        label: t('adminAction.buttons.assignTrbLead'),
        onClick: e => {
          if (assignLeadModalRef && assignLeadModalTrbRequestIdRef) {
            // eslint-disable-next-line no-param-reassign
            assignLeadModalTrbRequestIdRef.current = trbRequestId;
            assignLeadModalRef.current?.toggleModal(e, true);
          }
        }
      },
      viewSupportingDocuments: {
        label: t('adminAction.buttons.viewSupportingDocuments'),
        link: `/trb/${trbRequestId}/documents`
      },
      viewAdviceLetter: {
        label: t('adminAction.buttons.viewAdviceLetter'),
        link: `/trb/${trbRequestId}/advice`
      },
      startAdviceLetter: {
        label: t('adminAction.buttons.startAdviceLetter'),
        onClick: () =>
          createAdviceLetter()
            .then(
              result =>
                !result.errors &&
                history.push(`/trb/${trbRequestId}/advice/summary`)
            )
            // If error, display on advice letter form
            .catch(() =>
              history.push(`/trb/${trbRequestId}/advice/summary`, {
                error: true
              })
            )
      },
      continueAdviceLetter: {
        label: t('adminAction.buttons.continueAdviceLetter'),
        link: {
          pathname: `/trb/${trbRequestId}/advice/summary`,
          state: {
            fromAdmin: true
          }
        }
      },
      finalizeAdviceLetter: {
        label: t('adminAction.buttons.finalizeAdviceLetter'),
        link: `/trb/${trbRequestId}/advice/review`
      },
      addNote: {
        label: t('adminAction.buttons.addNote'),
        onClick: () => openNotes(true)
      }
    };

    if (state === TRBRequestState.CLOSED) {
      return [buttons.reopenRequest];
    }

    switch (status) {
      case TRBRequestStatus.REQUEST_FORM_COMPLETE:
        switch (activePage) {
          case 'initial-request-form':
            return [
              { ...buttons.requestEdits, outline: true },
              buttons.readyForConsult,
              buttons.orCloseRequest
            ];
          default:
            return [buttons.viewRequestForm, buttons.orCloseRequest];
        }
      case TRBRequestStatus.READY_FOR_CONSULT:
        return [
          buttons.addDateTime,
          ...(!leadAssigned ? [buttons.assignTrbLead] : []),
          buttons.orCloseRequest
        ];
      case TRBRequestStatus.CONSULT_SCHEDULED:
        switch (activePage) {
          case 'initial-request-form':
            return [
              { ...buttons.viewSupportingDocuments, outline: true },
              ...(!leadAssigned
                ? [{ ...buttons.assignTrbLead, outline: true }]
                : []),
              buttons.orCloseRequest
            ];
          case 'documents':
            return [
              { ...buttons.viewRequestForm, outline: true },
              ...(!leadAssigned
                ? [{ ...buttons.assignTrbLead, outline: true }]
                : []),
              buttons.orCloseRequest
            ];
          default:
            return [
              buttons.viewRequestForm,
              buttons.viewSupportingDocuments,
              ...(!leadAssigned ? [buttons.assignTrbLead] : []),
              buttons.orCloseRequest
            ];
        }
      case TRBRequestStatus.CONSULT_COMPLETE:
        switch (activePage) {
          case 'advice':
            return [buttons.startAdviceLetter, buttons.orCloseRequest];
          default:
            return [buttons.viewAdviceLetter, buttons.orCloseRequest];
        }
      case TRBRequestStatus.DRAFT_ADVICE_LETTER:
        switch (activePage) {
          case 'advice':
            return [buttons.continueAdviceLetter, buttons.orCloseRequest];
          default:
            return [buttons.viewAdviceLetter, buttons.orCloseRequest];
        }
      case TRBRequestStatus.ADVICE_LETTER_IN_REVIEW:
        switch (activePage) {
          case 'advice':
            return [
              buttons.addNote,
              { ...buttons.finalizeAdviceLetter, outline: true },
              buttons.orCloseRequestWithoutSending
            ];
          default:
            return [buttons.viewAdviceLetter, buttons.orCloseRequest];
        }
      case TRBRequestStatus.FOLLOW_UP_REQUESTED:
      case TRBRequestStatus.ADVICE_LETTER_SENT:
        return [buttons.closeRequest];
      default:
        return [];
    }
  }, [
    t,
    activePage,
    status,
    state,
    trbRequestId,
    history,
    createAdviceLetter,
    assignLeadModalRef,
    assignLeadModalTrbRequestIdRef,
    leadAssigned,
    openNotes
  ]);

  return actionButtons;
};

export default useTrbAdminActionButtons;
