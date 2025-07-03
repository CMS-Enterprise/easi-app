import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBPresentationLinksFragment,
  useDeleteSystemIntakeGRBPresentationLinksMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import useMessage from 'hooks/useMessage';

interface RequesterPresentationDeckProps {
  systemIntakeID: string;
  grbPresentationLinks?: SystemIntakeGRBPresentationLinksFragment | null;
}

/**
 * Display presentation deck information for task list
 *
 * Renders link to presentation deck form if no presentation deck has been uploaded
 */
const RequesterPresentationDeck = ({
  systemIntakeID,
  grbPresentationLinks
}: RequesterPresentationDeckProps) => {
  const { t } = useTranslation('itGov');
  const [removalModalOpen, setRemovalModalOpen] = useState(false);

  const {
    showMessage,
    showErrorMessageInModal,
    errorMessageInModal,
    clearMessage
  } = useMessage();

  const [deleteSystemIntakeGRBPresentationLinks] =
    useDeleteSystemIntakeGRBPresentationLinksMutation({
      variables: {
        input: {
          systemIntakeID
        }
      },
      refetchQueries: ['GetGovernanceTaskList']
    });

  /** Remove presentation links and handle error/success messages */
  const removePresentationLinks = () => {
    deleteSystemIntakeGRBPresentationLinks()
      .then(() => {
        showMessage(t('grbReview:asyncPresentation.modalRemoveLinks.success'), {
          type: 'success'
        });
        setRemovalModalOpen(false);
      })
      .catch(() => {
        showErrorMessageInModal(
          t('grbReview:asyncPresentation.modalRemoveLinks.error')
        );
      });
  };

  const {
    presentationDeckFileName,
    presentationDeckFileStatus,
    presentationDeckFileURL
  } = grbPresentationLinks || {};

  const hasPresentationDeck =
    !!presentationDeckFileName && !!presentationDeckFileURL;

  return (
    <>
      {/* Remove Presentation Modal */}
      <Modal
        isOpen={removalModalOpen}
        closeModal={() => {
          setRemovalModalOpen(false);
          clearMessage();
        }}
        shouldCloseOnOverlayClick
        className="maxw-mobile-lg height-auto"
      >
        <h3 className="margin-top-0">
          {t('taskList.step.grbMeeting.removeModal.title')}
        </h3>
        {errorMessageInModal && (
          <Alert type="error" className="margin-bottom-2">
            {errorMessageInModal}
          </Alert>
        )}
        <p className="font-body-md line-height-sans-4 margin-top-105">
          {t('taskList.step.grbMeeting.removeModal.text')}
        </p>
        <ButtonGroup>
          <Button
            type="button"
            className="bg-error margin-right-1"
            onClick={() => removePresentationLinks()}
          >
            {t('taskList.step.grbMeeting.removeModal.confirm')}
          </Button>
          <Button
            type="button"
            unstyled
            onClick={() => setRemovalModalOpen(false)}
          >
            {t('taskList.step.grbMeeting.removeModal.goBack')}
          </Button>
        </ButtonGroup>
      </Modal>

      <div className="margin-top-2" data-testid="presentation-deck-container">
        {!hasPresentationDeck ? (
          /* If presentation deck is not uploaded, then show upload button */
          <UswdsReactLink
            variant="unstyled"
            className="usa-button"
            to={`/governance-task-list/${systemIntakeID}/presentation-deck-upload`}
            data-testid="presentation-deck-upload-link"
          >
            {t('taskList.step.grbMeeting.presentationUploadButton')}
          </UswdsReactLink>
        ) : (
          /* Else, render file status as pending or the actual file name */
          <>
            {presentationDeckFileStatus === 'PENDING' ? (
              <span
                className="text-italic"
                data-testid="presentation-deck-pending-status"
              >
                {t('itGov:taskList.step.grbMeeting.scanning')}
              </span>
            ) : (
              <>
                <span
                  className="margin-right-1"
                  data-testid="presentation-deck-file-name"
                >
                  <Trans
                    i18nKey="itGov:taskList.step.grbMeeting.uploadPresentation"
                    components={{
                      strong: <strong />
                    }}
                    values={{
                      fileName: presentationDeckFileName
                    }}
                  />
                </span>

                <UswdsReactLink
                  to={presentationDeckFileURL}
                  target="_blank"
                  className="margin-right-1"
                  data-testid="presentation-deck-view-link"
                >
                  {t('taskList.step.grbMeeting.view')}
                </UswdsReactLink>
                <Button
                  className="text-error"
                  type="button"
                  unstyled
                  onClick={() => setRemovalModalOpen(true)}
                  data-testid="presentation-deck-remove-button"
                >
                  {t('taskList.step.grbMeeting.remove')}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RequesterPresentationDeck;
