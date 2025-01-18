import React, { useState } from 'react';
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
import { useDeleteSystemIntakeGRBPresentationLinksMutation } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import IconLink from 'components/shared/IconLink';
import { SystemIntake } from 'queries/types/SystemIntake';
import { SystemIntakeDocumentStatus } from 'types/graphql-global-types';

type Props = {
  systemIntakeID: string;
  grbPresentationLinks: SystemIntake['grbPresentationLinks'];
};

function PresentationLinksCard({
  systemIntakeID,
  grbPresentationLinks
}: Props) {
  const { t } = useTranslation('grbReview');

  const [isEmptyAdmin, setIsEmptyAdmin] = useState(false);
  const { recordingLink, transcriptFileStatus, presentationDeckFileStatus } =
    grbPresentationLinks || {};

  const isEmpty =
    grbPresentationLinks === null ||
    (grbPresentationLinks &&
      recordingLink === null &&
      transcriptFileStatus === SystemIntakeDocumentStatus.UNAVAILABLE &&
      presentationDeckFileStatus === SystemIntakeDocumentStatus.UNAVAILABLE);

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
      // .then(() => {})
      .finally(() => {
        setIsEmptyAdmin(true);
        setRemovePresentationLinksModalOpen(false);
      });
  };

  return (
    <>
      {/* Asynchronous presentation */}
      <div className="usa-card__container margin-left-0 border-width-1px shadow-2 margin-top-3 margin-bottom-4">
        <CardHeader>
          <h3 className="display-inline-block margin-right-2 margin-bottom-0">
            {t('asyncPresentation.title')}
          </h3>
        </CardHeader>
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
        <CardFooter>
          {!isEmptyAdmin && (
            <>
              <Divider className="margin-bottom-2" />
              <div className="display-flex flex-wrap">
                {grbPresentationLinks?.recordingLink && (
                  <Link
                    className="margin-right-2 display-flex flex-align-center"
                    href={grbPresentationLinks.recordingLink}
                    target="_blank"
                  >
                    {t('asyncPresentation.viewRecording')}
                    <Icon.Launch className="margin-left-05" />
                  </Link>
                )}
                {grbPresentationLinks?.recordingPasscode && (
                  <span className="text-base margin-right-2">
                    {t('asyncPresentation.passcode', {
                      passcode: grbPresentationLinks.recordingPasscode
                    })}
                  </span>
                )}
                {grbPresentationLinks &&
                  grbPresentationLinks.transcriptFileStatus ===
                    SystemIntakeDocumentStatus.AVAILABLE &&
                  grbPresentationLinks.transcriptFileURL && (
                    <Link
                      className="margin-right-2"
                      href={grbPresentationLinks.transcriptFileURL}
                      target="_blank"
                    >
                      {t('asyncPresentation.viewTranscript')}
                    </Link>
                  )}
                {grbPresentationLinks &&
                  grbPresentationLinks.presentationDeckFileStatus ===
                    SystemIntakeDocumentStatus.AVAILABLE &&
                  grbPresentationLinks.presentationDeckFileURL && (
                    <Link
                      className="margin-right-2"
                      href={grbPresentationLinks.presentationDeckFileURL}
                      target="_blank"
                    >
                      {t('asyncPresentation.viewSlideDeck')}
                    </Link>
                  )}
              </div>
            </>
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
    </>
  );
}

export default PresentationLinksCard;
