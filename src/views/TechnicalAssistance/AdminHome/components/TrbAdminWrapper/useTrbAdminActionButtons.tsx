import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { AdminActionButton } from 'components/shared/AdminAction';
import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import { TrbAdminPath } from 'types/technicalAssistance';

type ActionButtonsProps = {
  trbRequestId: string;
  activePage: TrbAdminPath;
  status: TRBRequestStatus | undefined;
  state: TRBRequestState | undefined;
};

const useTrbAdminActionButtons = ({
  trbRequestId,
  activePage,
  status,
  state
}: ActionButtonsProps): AdminActionButton[] => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const actionButtons: AdminActionButton[] = useMemo(() => {
    const buttons = {
      orCloseRequest: {
        label: t('adminAction.buttons.orCloseRequest'),
        onClick: () => null,
        unstyled: true
      },
      closeRequest: {
        label: t('adminAction.buttons.closeRequest'),
        onClick: () => null
      },
      reopenRequest: {
        label: t('adminAction.buttons.reopenRequest'),
        onClick: () => null
      },
      viewRequestForm: {
        label: t('adminAction.buttons.viewRequestForm'),
        onClick: () => history.push(`/trb/${trbRequestId}/initial-request-form`)
      },
      requestEdits: {
        label: t('adminAction.buttons.requestEdits'),
        onClick: () => null
      },
      readyForConsult: {
        label: t('adminAction.buttons.readyForConsult'),
        onClick: () => null
      },
      addDateTime: {
        label: t('adminAction.buttons.addDateTime'),
        onClick: () => null
      },
      assignTrbLead: {
        label: t('adminAction.buttons.assignTrbLead'),
        onClick: () => null
      },
      viewSupportingDocuments: {
        label: t('adminAction.buttons.viewSupportingDocuments'),
        onClick: () => null
      },
      viewAdviceLetter: {
        label: t('adminAction.buttons.viewAdviceLetter'),
        onClick: () => null
      },
      startAdviceLetter: {
        label: t('adminAction.buttons.startAdviceLetter'),
        onClick: () => null
      },
      continueAdviceLetter: {
        label: t('adminAction.buttons.continueAdviceLetter'),
        onClick: () => null
      },
      editAdviceLetter: {
        label: t('adminAction.buttons.editAdviceLetter'),
        onClick: () => null
      },
      addNote: {
        label: t('adminAction.buttons.addNote'),
        onClick: () => null
      }
    };

    if (state === TRBRequestState.CLOSED) {
      return [buttons.closeRequest];
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
          buttons.assignTrbLead,
          buttons.orCloseRequest
        ];
      case TRBRequestStatus.CONSULT_SCHEDULED:
        switch (activePage) {
          case 'initial-request-form':
            return [
              { ...buttons.viewSupportingDocuments, outline: true },
              { ...buttons.assignTrbLead, outline: true },
              buttons.orCloseRequest
            ];
          case 'documents':
            return [
              { ...buttons.viewRequestForm, outline: true },
              { ...buttons.assignTrbLead, outline: true },
              buttons.orCloseRequest
            ];
          default:
            return [
              buttons.viewRequestForm,
              buttons.viewSupportingDocuments,
              buttons.assignTrbLead
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
              { ...buttons.editAdviceLetter, outline: true },
              buttons.orCloseRequest
            ];
          default:
            return [buttons.viewAdviceLetter, buttons.orCloseRequest];
        }
      case TRBRequestStatus.ADVICE_LETTER_SENT:
        return [buttons.closeRequest];
      default:
        return [];
    }
  }, [activePage, status, state, trbRequestId, history, t]);

  return actionButtons;
};

export default useTrbAdminActionButtons;
