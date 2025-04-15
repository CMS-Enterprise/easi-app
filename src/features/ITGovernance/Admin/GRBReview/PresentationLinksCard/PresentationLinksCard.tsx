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
  useDeleteSystemIntakeGRBPresentationLinksMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ExternalLinkAndModal from 'components/ExternalLinkAndModal';
import IconLink from 'components/IconLink';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import useMessage from 'hooks/useMessage';
import { downloadFileFromURL } from 'utils/downloadFile';

import ITGovAdminContext from '../../../../../wrappers/ITGovAdminContext/ITGovAdminContext';

export type PresentationLinksCardProps = {
  systemIntakeID: string;
  grbPresentationLinks?: SystemIntakeGRBPresentationLinksFragmentFragment | null;
  asyncStatus?: SystemIntakeGRBReviewAsyncStatusType | null;
};

function PresentationLinksCard({
  systemIntakeID,
  grbPresentationLinks,
  asyncStatus
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

  // Render empty if not an admin and no links
  if (!isITGovAdmin && !hasAnyLinks) return null;

  return (
    <>
      {/* Asynchronous presentation links card */}
      <Card
        containerProps={{ className: 'margin-0 radius-md shadow-2' }}
        className="margin-top-2"
      >
        <CardHeader>
          <h3>{t('asyncPresentation.title')}</h3>
        </CardHeader>
        {
          // Hide action buttons for GRB reviewers
          isITGovAdmin ? (
            <CardBody
              className={classNames('padding-top-0', {
                'display-flex flex-gap-105 padding-bottom-105 margin-top-neg-1':
                  hasAnyLinks
              })}
            >
              {asyncStatus ===
                SystemIntakeGRBReviewAsyncStatusType.COMPLETED && (
                <span className="text-base-dark">
                  <Trans
                    i18nKey="grbReview:asyncCompleted.presentationLinks"
                    components={{
                      // TODO: Add link to restart review
                      link1: <UswdsReactLink to="/">restart</UswdsReactLink>
                    }}
                  />
                </span>
              )}
              {asyncStatus !== SystemIntakeGRBReviewAsyncStatusType.COMPLETED &&
                (!hasAnyLinks ? (
                  <>
                    <Alert type="info" slim className="margin-bottom-2">
                      {t('asyncPresentation.adminEmptyAlert')}
                    </Alert>
                    <IconLink
                      icon={<Icon.Add />}
                      to={`/it-governance/${systemIntakeID}/grb-review/presentation-links`}
                    >
                      {t('asyncPresentation.addAsynchronousPresentationLinks')}
                    </IconLink>
                  </>
                ) : (
                  <>
                    <UswdsReactLink
                      to={`/it-governance/${systemIntakeID}/grb-review/presentation-links`}
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
                  </>
                ))}
            </CardBody>
          ) : (
            <>
              {!hasAnyLinks && (
                <div className="padding-x-3 padding-y-2">
                  <Alert type="info" slim className="margin-bottom-2">
                    {t('asyncPresentation.emptyAlert')}
                  </Alert>
                </div>
              )}
            </>
          )
        }
        {hasAnyLinks && (
          <CardFooter className="presentation-card-links display-flex flex-wrap flex-column-gap-3 flex-row-gap-1 padding-x-0 padding-bottom-205 padding-top-2 margin-x-3 border-top-1px border-gray-10">
            {isVirusScanning ? (
              <em
                data-testdeckurl={presentationDeckFileURL || transcriptFileURL}
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
