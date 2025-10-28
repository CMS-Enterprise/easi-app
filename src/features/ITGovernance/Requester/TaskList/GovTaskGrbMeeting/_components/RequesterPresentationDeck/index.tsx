import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import {
  GetGovernanceTaskListDocument,
  ITGovGRBStatus,
  SystemIntakeGRBPresentationLinksFragment,
  SystemIntakeGRBReviewType,
  useDeleteSystemIntakeGRBPresentationLinksMutation
} from 'gql/generated/graphql';
import { useErrorMessage } from 'wrappers/ErrorContext';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import toastSuccess from 'components/ToastSuccess';

interface RequesterPresentationDeckProps {
  systemIntakeID: string;
  grbMeetingStatus: ITGovGRBStatus;
  grbReviewType: SystemIntakeGRBReviewType;
  grbPresentationLinks:
    | SystemIntakeGRBPresentationLinksFragment
    | null
    | undefined;
}

/**
 * Display presentation deck information for task list
 *
 * Renders link to presentation deck form if no presentation deck has been uploaded
 */
const RequesterPresentationDeck = ({
  systemIntakeID,
  grbMeetingStatus,
  grbReviewType,
  grbPresentationLinks
}: RequesterPresentationDeckProps) => {
  const { t } = useTranslation('itGov');
  const [removalModalOpen, setRemovalModalOpen] = useState(false);

  const [deleteSystemIntakeGRBPresentationLinks] =
    useDeleteSystemIntakeGRBPresentationLinksMutation({
      variables: {
        input: {
          systemIntakeID
        }
      },
      refetchQueries: [
        {
          query: GetGovernanceTaskListDocument,
          variables: { id: systemIntakeID }
        }
      ]
    });

  const { setErrorMeta } = useErrorMessage();

  /** Remove presentation links and handle error/success messages */
  const removePresentationLinks = () => {
    setErrorMeta({
      overrideMessage: t('grbReview:asyncPresentation.modalRemoveLinks.error')
    });

    deleteSystemIntakeGRBPresentationLinks().then(() => {
      toastSuccess(t('grbReview:asyncPresentation.modalRemoveLinks.success'));
      setRemovalModalOpen(false);
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
        }}
        shouldCloseOnOverlayClick
        className="maxw-mobile-lg height-auto"
        id="removePresentationModal"
        aria={{
          labelledby: 'removePresentationModalTitle'
        }}
      >
        <h3 className="margin-top-0" id="removePresentationModalTitle">
          {t('taskList.step.grbMeeting.removeModal.title')}
        </h3>
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
                data-testid="presentation-deck-virus-scanning"
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

                {
                  // For standard meetings, always render view button
                  (grbReviewType === SystemIntakeGRBReviewType.STANDARD ||
                    // For async reviews, only render view button if review is in progress
                    grbMeetingStatus === ITGovGRBStatus.REVIEW_IN_PROGRESS) && (
                    <UswdsReactLink
                      to={presentationDeckFileURL}
                      target="_blank"
                      className="margin-right-1"
                      data-testid="presentation-deck-view-link"
                    >
                      {t('taskList.step.grbMeeting.view')}
                    </UswdsReactLink>
                  )
                }

                {
                  // For async reviews, hide the remove button if review is in progress
                  grbMeetingStatus !== ITGovGRBStatus.REVIEW_IN_PROGRESS && (
                    <Button
                      className="text-error"
                      type="button"
                      unstyled
                      onClick={() => setRemovalModalOpen(true)}
                      data-testid="presentation-deck-remove-button"
                    >
                      {t('taskList.step.grbMeeting.remove')}
                    </Button>
                  )
                }
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RequesterPresentationDeck;
