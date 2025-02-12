import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Link,
  ModalHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useDeleteSystemIntakeGRBPresentationLinksMutation } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import Alert from 'components/shared/Alert';
import ExternalDocumentLinkModal from 'components/shared/ExternalDocumentLinkModal';
import IconLink from 'components/shared/IconLink';
import useMessage from 'hooks/useMessage';
import { SystemIntake } from 'queries/types/SystemIntake';
import { SystemIntakeDocumentStatus } from 'types/graphql-global-types';

import ITGovAdminContext from '../ITGovAdminContext';

export type PresentationLinksCardProps = {
  systemIntakeID: string;
  grbPresentationLinks: SystemIntake['grbPresentationLinks'];
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
    transcriptFileStatus,
    transcriptFileURL,
    presentationDeckFileStatus,
    presentationDeckFileURL
  } = grbPresentationLinks || {};

  const isEmpty =
    grbPresentationLinks === null ||
    (grbPresentationLinks &&
      recordingLink === null &&
      transcriptFileStatus === SystemIntakeDocumentStatus.UNAVAILABLE &&
      presentationDeckFileStatus === SystemIntakeDocumentStatus.UNAVAILABLE);

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
      }
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

  // External link modal handling

  const [externalUrl, setExternalUrl] = useState<string>('');
  const [isExternalModalOpen, setExternalModalOpen] = useState<boolean>(false);

  const externalModalScopeRef = useRef<HTMLDivElement>(null);

  function linkHandler(event: MouseEvent) {
    const a = (event.target as HTMLElement)?.closest(
      '.presentation-card-links a'
    );
    if (a) {
      event.preventDefault();
      const href = a.getAttribute('href');
      if (href) {
        setExternalUrl(href);
        setExternalModalOpen(true);
      }
    }
  }

  useEffect(() => {
    const eventEl = externalModalScopeRef.current;
    eventEl?.addEventListener('click', linkHandler);
    return () => {
      eventEl?.removeEventListener('click', linkHandler);
    };
  }, []);

  // Render empty if not an admin and no links
  if (!isITGovAdmin && isEmpty) return null;

  return (
    <>
      {/* Asynchronous presentation links card */}
      <div className="usa-card__container margin-left-0 border-width-1px shadow-2 margin-top-3 margin-bottom-4">
        <CardHeader
          className={classNames({ 'padding-bottom-0': !isITGovAdmin })}
        >
          <h3 className="display-inline-block margin-right-2 margin-bottom-0">
            {t('asyncPresentation.title')}
          </h3>
        </CardHeader>
        {
          // Hide action buttons for GRB reviewers
          isITGovAdmin && (
            <CardBody>
              {isEmpty ? (
                <>
                  <Alert type="info" slim className="margin-bottom-1">
                    {t('asyncPresentation.adminEmptyAlert')}
                  </Alert>
                  <div className="margin-top-2 margin-bottom-neg-2">
                    <IconLink
                      icon={<Icon.Add className="margin-right-1" />}
                      to={`/it-governance/${systemIntakeID}/grb-review/presentation-links`}
                    >
                      {t('asyncPresentation.addAsynchronousPresentationLinks')}
                    </IconLink>
                  </div>
                </>
              ) : (
                <div className="margin-top-neg-1">
                  <UswdsReactLink
                    className="margin-right-2"
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
                </div>
              )}
            </CardBody>
          )
        }
        <CardFooter>
          {!isEmpty && (
            <div
              ref={externalModalScopeRef}
              className="presentation-card-links display-flex flex-wrap border-top-1px border-gray-10 padding-top-2"
            >
              {isVirusScanning ? (
                <em>{t('asyncPresentation.virusScanning')}</em>
              ) : (
                <>
                  {recordingLink && (
                    <Link
                      className="margin-right-2 display-flex flex-align-center"
                      href={recordingLink}
                      target="_blank"
                    >
                      {t('asyncPresentation.viewRecording')}
                      <Icon.Launch className="margin-left-05" />
                    </Link>
                  )}
                  {recordingPasscode && (
                    <span className="text-base margin-right-2">
                      {t('asyncPresentation.passcode', {
                        passcode: recordingPasscode
                      })}
                    </span>
                  )}
                  {transcriptFileStatus ===
                    SystemIntakeDocumentStatus.AVAILABLE &&
                    transcriptFileURL && (
                      <Link
                        className="margin-right-2"
                        href={transcriptFileURL}
                        target="_blank"
                      >
                        {t('asyncPresentation.viewTranscript')}
                      </Link>
                    )}
                  {presentationDeckFileStatus ===
                    SystemIntakeDocumentStatus.AVAILABLE &&
                    presentationDeckFileURL && (
                      <Link
                        className="margin-right-2"
                        href={presentationDeckFileURL}
                        target="_blank"
                      >
                        {t('asyncPresentation.viewSlideDeck')}
                      </Link>
                    )}
                </>
              )}
            </div>
          )}
        </CardFooter>
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

      {/* Modal for external links */}
      <ExternalDocumentLinkModal
        isOpen={isExternalModalOpen}
        url={externalUrl}
        closeModal={() => setExternalModalOpen(false)}
      />
    </>
  );
}

export default PresentationLinksCard;
