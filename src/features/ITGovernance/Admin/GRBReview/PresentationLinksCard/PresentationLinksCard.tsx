import React, { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  ModalHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeDocumentStatus,
  SystemIntakeGRBPresentationLinksFragmentFragment,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewStandardStatusType,
  SystemIntakeGRBReviewType,
  useDeleteSystemIntakeGRBPresentationLinksMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ExternalLinkAndModal from 'components/ExternalLinkAndModal';
import IconLink from 'components/IconLink';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import useMessage from 'hooks/useMessage';
import { formatDateLocal } from 'utils/date';
import { downloadFileFromURL } from 'utils/downloadFile';

import ITGovAdminContext from '../../../../../wrappers/ITGovAdminContext/ITGovAdminContext';
import { useRestartReviewModal } from '../RestartReviewModal/RestartReviewModalContext';

export type PresentationCardActionsProps = {
  systemIntakeID: string;
  hasAnyLinks: boolean;
  setRemovePresentationLinksModalOpen: (open: boolean) => void;
  grbReviewStartedAt: string | null | undefined;
  grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType | null | undefined;
};

/**
 * Renders action buttons for the presentation links card
 * at different stages of the review process
 */
const PresentationCardActions = ({
  systemIntakeID,
  grbReviewStartedAt,
  hasAnyLinks,
  setRemovePresentationLinksModalOpen,
  grbReviewAsyncStatus
}: PresentationCardActionsProps) => {
  const { t } = useTranslation('grbReview');

  const { openModal: openRestartReviewModal } = useRestartReviewModal();

  if (!grbReviewStartedAt) {
    return (
      <>
        <Alert type="warning" slim className="margin-bottom-2">
          {t('asyncPresentation.reviewSetupNotCompleted')}
        </Alert>
        <IconLink
          icon={<Icon.ArrowForward aria-hidden />}
          to={`/it-governance/${systemIntakeID}/grb-review/review-type`}
          iconPosition="after"
        >
          {t('asyncPresentation.continueReviewSetup')}
        </IconLink>
      </>
    );
  }

  if (grbReviewAsyncStatus === SystemIntakeGRBReviewAsyncStatusType.COMPLETED) {
    return (
      <p className="text-base-dark margin-y-0">
        <Trans
          i18nKey="grbReview:asyncCompleted.presentationLinks"
          components={{
            link1: (
              <Button type="button" unstyled onClick={openRestartReviewModal}>
                {t('restartReview')}
              </Button>
            )
          }}
        />
      </p>
    );
  }

  if (!hasAnyLinks) {
    return (
      <>
        <Alert type="info" slim className="margin-bottom-2">
          {t('asyncPresentation.adminEmptyAlert')}
        </Alert>
        <IconLink
          icon={<Icon.Add aria-hidden />}
          to={`/it-governance/${systemIntakeID}/grb-review/presentation-links`}
        >
          {t('asyncPresentation.addAsynchronousPresentationLinks')}
        </IconLink>
      </>
    );
  }

  return (
    <ButtonGroup data-testid="presentation-card-actions">
      <UswdsReactLink
        to={`/it-governance/${systemIntakeID}/grb-review/presentation-links`}
        className="margin-right-1"
      >
        {t('asyncPresentation.editPresentationLinks')}
      </UswdsReactLink>
      <Button
        type="button"
        unstyled
        className="text-error"
        onClick={() => setRemovePresentationLinksModalOpen(true)}
      >
        {t('asyncPresentation.removeAllPresentationLinks')}
      </Button>
    </ButtonGroup>
  );
};

export type PresentationLinksCardProps = {
  systemIntakeID: string;
  grbReviewType: SystemIntakeGRBReviewType | undefined;
  grbReviewStartedAt: string | null | undefined;
  grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType | null | undefined;
  grbReviewStandardStatus:
    | SystemIntakeGRBReviewStandardStatusType
    | null
    | undefined;
  grbReviewAsyncRecordingTime: string | null | undefined;
  grbPresentationLinks:
    | SystemIntakeGRBPresentationLinksFragmentFragment
    | null
    | undefined;
};

function PresentationLinksCard({
  systemIntakeID,
  grbReviewType,
  grbReviewStartedAt,
  grbPresentationLinks,
  grbReviewAsyncStatus,
  grbReviewStandardStatus,
  grbReviewAsyncRecordingTime
}: PresentationLinksCardProps) {
  const { t } = useTranslation('grbReview');

  const isITGovAdmin = useContext(ITGovAdminContext);

  const { showMessage } = useMessage();

  const {
    recordingLink,
    recordingPasscode,
    transcriptLink,
    transcriptFileName,
    transcriptFileStatus,
    transcriptFileURL,
    presentationDeckFileName,
    presentationDeckFileStatus,
    presentationDeckFileURL
  } = grbPresentationLinks || {};

  /** Returns true if either document is still being scanned */
  const isVirusScanning =
    transcriptFileStatus === SystemIntakeDocumentStatus.PENDING ||
    presentationDeckFileStatus === SystemIntakeDocumentStatus.PENDING;

  const hasAnyLinks: boolean =
    !!recordingLink || !!transcriptLink || !!presentationDeckFileURL;

  // Remove links handling

  const [deleteSystemIntakeGRBPresentationLinks] =
    useDeleteSystemIntakeGRBPresentationLinksMutation({
      variables: {
        input: {
          systemIntakeID
        }
      },
      refetchQueries: ['GetSystemIntake']
    });

  const [
    isRemovePresentationLinksModalOpen,
    setRemovePresentationLinksModalOpen
  ] = useState<boolean>(false);

  const removePresentationLinks = () => {
    deleteSystemIntakeGRBPresentationLinks()
      .then(() => {
        showMessage(t('asyncPresentation.modalRemoveLinks.success'), {
          type: 'success'
        });
      })
      .catch(() => {
        showMessage(t('asyncPresentation.modalRemoveLinks.error'), {
          type: 'error'
        });
      })
      .finally(() => {
        setRemovePresentationLinksModalOpen(false);
      });
  };

  return (
    <>
      {/* Asynchronous presentation links card */}
      <Card
        containerProps={
          {
            className: 'margin-0 radius-md shadow-2',
            'data-testid': 'presentation-links-card'
            // Fix for 'data-testid' type error - attr does render on container
          } as React.HTMLAttributes<HTMLDivElement>
        }
        className="margin-top-2"
      >
        <CardHeader>
          <h3 className="margin-y-0 margin-right-2 display-inline-block">
            {t('asyncPresentation.title')}
          </h3>
          {grbReviewType === SystemIntakeGRBReviewType.ASYNC && (
            <span className="text-base">
              {t(
                grbReviewAsyncRecordingTime
                  ? 'asyncPresentation.asyncPresentationDate'
                  : 'asyncPresentation.asyncPresentationNotScheduled',
                {
                  date: formatDateLocal(
                    grbReviewAsyncRecordingTime,
                    'MM/dd/yyyy'
                  )
                }
              )}
            </span>
          )}
        </CardHeader>
        {/* Render action links for admins only */}
        {isITGovAdmin &&
          // Hide actions if standard meeting is complete
          grbReviewStandardStatus !==
            SystemIntakeGRBReviewStandardStatusType.COMPLETED && (
            <CardBody
              className={classNames('padding-top-0', {
                'display-flex flex-gap-105 padding-bottom-105 margin-top-neg-1':
                  hasAnyLinks
              })}
            >
              <PresentationCardActions
                systemIntakeID={systemIntakeID}
                grbReviewStartedAt={grbReviewStartedAt}
                hasAnyLinks={hasAnyLinks}
                setRemovePresentationLinksModalOpen={
                  setRemovePresentationLinksModalOpen
                }
                grbReviewAsyncStatus={grbReviewAsyncStatus}
              />
            </CardBody>
          )}
        {hasAnyLinks && grbReviewStartedAt && (
          <CardFooter className="presentation-card-links display-flex flex-wrap flex-column-gap-3 flex-row-gap-1 padding-x-0 padding-bottom-205 padding-top-2 margin-x-3 border-top-1px border-gray-10">
            {isVirusScanning ? (
              <em
                data-testdeckurl={presentationDeckFileURL || transcriptFileURL}
                data-testid="presentation-deck-virus-scanning"
              >
                {t('asyncPresentation.virusScanning')}
              </em>
            ) : (
              <>
                {(recordingLink || recordingPasscode || transcriptLink) && (
                  <div className="display-flex flex-wrap flex-gap-1">
                    {recordingLink && (
                      <ExternalLinkAndModal href={recordingLink}>
                        {t('asyncPresentation.viewRecording')}
                      </ExternalLinkAndModal>
                    )}

                    {!recordingLink &&
                      (recordingPasscode || transcriptLink) && (
                        <span>
                          {t('asyncPresentation.noRecordingLinkAvailable')}
                        </span>
                      )}

                    {recordingPasscode && (
                      <span className="text-base">
                        {t('asyncPresentation.passcode', {
                          passcode: recordingPasscode
                        })}
                      </span>
                    )}
                  </div>
                )}

                {transcriptLink && (
                  <ExternalLinkAndModal href={transcriptLink}>
                    {t('asyncPresentation.viewTranscript')}
                  </ExternalLinkAndModal>
                )}

                {transcriptFileStatus ===
                  SystemIntakeDocumentStatus.AVAILABLE &&
                  transcriptFileURL &&
                  transcriptFileName && (
                    <Button
                      type="button"
                      onClick={() =>
                        downloadFileFromURL(
                          transcriptFileURL,
                          transcriptFileName
                        )
                      }
                      unstyled
                    >
                      {t('asyncPresentation.viewTranscript')}
                    </Button>
                  )}

                {presentationDeckFileStatus ===
                  SystemIntakeDocumentStatus.AVAILABLE &&
                  presentationDeckFileURL &&
                  presentationDeckFileName && (
                    <Button
                      type="button"
                      onClick={() =>
                        downloadFileFromURL(
                          presentationDeckFileURL,
                          presentationDeckFileName
                        )
                      }
                      unstyled
                    >
                      {t('asyncPresentation.viewSlideDeck')}
                    </Button>
                  )}
              </>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Modal to remove presentation links */}
      <Modal
        isOpen={isRemovePresentationLinksModalOpen}
        closeModal={() => setRemovePresentationLinksModalOpen(false)}
      >
        <ModalHeading>
          {t('asyncPresentation.modalRemoveLinks.title')}
        </ModalHeading>

        <p>{t('asyncPresentation.modalRemoveLinks.text')}</p>

        <ButtonGroup>
          <Button
            className="margin-right-1 bg-error"
            type="button"
            onClick={removePresentationLinks}
          >
            {t('asyncPresentation.modalRemoveLinks.confirm')}
          </Button>

          <Button
            type="button"
            unstyled
            onClick={() => setRemovePresentationLinksModalOpen(false)}
          >
            {t('asyncPresentation.modalRemoveLinks.cancel')}
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  );
}

export default PresentationLinksCard;
