import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
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
  useDeleteSystemIntakeGRBPresentationLinksMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ExternalLinkAndModal from 'components/ExternalLinkAndModal';
import IconLink from 'components/IconLink';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import useMessage from 'hooks/useMessage';
import { downloadFileFromURL } from 'utils/downloadFile';

import ITGovAdminContext from '../ITGovAdminContext';

export type PresentationLinksCardProps = {
  systemIntakeID: string;
  grbPresentationLinks?: SystemIntakeGRBPresentationLinksFragmentFragment | null;
};

function PresentationLinksCard({
  systemIntakeID,
  grbPresentationLinks
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
  if (!isITGovAdmin && !grbPresentationLinks) return null;

  return (
    <>
      {/* Asynchronous presentation links card */}
      <div className="usa-card__container margin-x-0 border-width-1px shadow-2 margin-top-3 margin-bottom-4">
        <CardHeader>
          <h3>{t('asyncPresentation.title')}</h3>
        </CardHeader>
        {
          // Hide action buttons for GRB reviewers
          isITGovAdmin && (
            <CardBody
              className={classNames('padding-top-0', {
                'display-flex flex-gap-105 padding-bottom-105 margin-top-neg-1':
                  grbPresentationLinks
              })}
            >
              {!grbPresentationLinks ? (
                <>
                  <Alert type="info" slim className="margin-bottom-2">
                    {t('asyncPresentation.adminEmptyAlert')}
                  </Alert>
                  <IconLink
                    icon={<Icon.Add aria-label="add" />}
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
              )}
            </CardBody>
          )
        }
        {grbPresentationLinks && (
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
      </div>

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
