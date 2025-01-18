import React, { useCallback, useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewersDocument,
  SystemIntakeGRBReviewerFragment,
  useDeleteSystemIntakeGRBPresentationLinksMutation,
  useDeleteSystemIntakeGRBReviewerMutation,
  useStartGRBReviewMutation
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import IconLink from 'components/shared/IconLink';
import useMessage from 'hooks/useMessage';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import { SystemIntakeDocument } from 'queries/types/SystemIntakeDocument';
import { BusinessCaseModel } from 'types/businessCase';
import { SystemIntakeState } from 'types/graphql-global-types';
import { GRBReviewFormAction } from 'types/grbReview';
import { formatDateLocal } from 'utils/date';
import DocumentsTable from 'views/SystemIntake/Documents/DocumentsTable';

import ITGovAdminContext from '../ITGovAdminContext';

import Discussions from './Discussions';
import GRBReviewerForm from './GRBReviewerForm';
import ParticipantsTable from './ParticipantsTable';

import './index.scss';

type GRBReviewProps = {
  id: string;
  submittedAt: string | null;
  state: SystemIntakeState;
  businessCase: BusinessCaseModel;
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  documents: SystemIntakeDocument[];
  grbReviewStartedAt?: string | null;
  grbPresentationLinks: SystemIntake['grbPresentationLinks'];
};

const GRBReview = ({
  id,
  businessCase,
  submittedAt,
  state,
  grbReviewers,
  documents,
  grbReviewStartedAt,
  grbPresentationLinks
}: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');
  const history = useHistory();

  const { action } = useParams<{
    action?: GRBReviewFormAction;
  }>();

  const isForm = !!action;

  const [reviewerToRemove, setReviewerToRemove] =
    useState<SystemIntakeGRBReviewerFragment | null>(null);

  const [startReviewModalIsOpen, setStartReviewModalIsOpen] =
    useState<boolean>(false);

  // todo tmp bool to toggle display state, determine with actual variables next
  // do not show card at all for non-admin + empty
  const [isEmptyAdmin, setIsEmptyAdmin] = useState(false);

  const [deleteSystemIntakeGRBPresentationLinks] =
    useDeleteSystemIntakeGRBPresentationLinksMutation({
      variables: {
        input: {
          systemIntakeID: id
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
        setIsEmptyAdmin(true);
      })
      .finally(() => {
        setRemovePresentationLinksModalOpen(false);
      });
  };

  const { showMessage } = useMessage();

  const [mutate] = useDeleteSystemIntakeGRBReviewerMutation({
    refetchQueries: [GetSystemIntakeGRBReviewersDocument]
  });

  const [startGRBReview] = useStartGRBReviewMutation({
    variables: {
      input: {
        systemIntakeID: id
      }
    },
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersDocument,
        variables: { id }
      }
    ]
  });

  const isITGovAdmin = useContext(ITGovAdminContext);

  const removeGRBReviewer = useCallback(
    (reviewer: SystemIntakeGRBReviewerFragment) => {
      mutate({ variables: { input: { reviewerID: reviewer.id } } })
        .then(() =>
          showMessage(
            <Trans
              i18nKey="grbReview:messages.success.remove"
              values={{ commonName: reviewer.userAccount.commonName }}
            />,
            { type: 'success' }
          )
        )
        .catch(() =>
          showMessage(t('form.messages.error.remove'), { type: 'error' })
        );

      // Reset `reviewerToRemove` to close modal
      setReviewerToRemove(null);

      // If removing reviewer from form, go to GRB Review page
      if (isForm) {
        history.push(`/it-governance/${id}/grb-review`);
      }
    },
    [history, isForm, id, mutate, showMessage, t]
  );

  return (
    <>
      {
        // Remove GRB reviewer modal
        !!reviewerToRemove && (
          <Modal
            isOpen={!!reviewerToRemove}
            closeModal={() => setReviewerToRemove(null)}
          >
            <ModalHeading>
              {t('removeModal.title', {
                commonName: reviewerToRemove.userAccount.commonName
              })}
            </ModalHeading>
            <p>{t('removeModal.text')}</p>
            <ModalFooter>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => removeGRBReviewer(reviewerToRemove)}
                  className="bg-error margin-right-1"
                >
                  {t('removeModal.remove')}
                </Button>
                <Button
                  type="button"
                  onClick={() => setReviewerToRemove(null)}
                  unstyled
                >
                  {t('Cancel')}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </Modal>
        )
      }

      {isForm ? (
        <GRBReviewerForm
          setReviewerToRemove={setReviewerToRemove}
          initialGRBReviewers={grbReviewers}
          grbReviewStartedAt={grbReviewStartedAt}
        />
      ) : (
        <>
          {
            // Start GRB Review modal
            startReviewModalIsOpen && (
              <Modal
                isOpen={startReviewModalIsOpen}
                closeModal={() => setStartReviewModalIsOpen(false)}
              >
                <ModalHeading>{t('startReviewModal.heading')}</ModalHeading>
                <p>
                  {t('startReviewModal.text', { count: grbReviewers.length })}
                </p>
                <ModalFooter>
                  <ButtonGroup>
                    <Button
                      type="button"
                      onClick={() =>
                        startGRBReview()
                          .then(() => setStartReviewModalIsOpen(false))
                          .catch(() => {
                            showMessage(t('startGrbReviewError'), {
                              type: 'error'
                            });
                            setStartReviewModalIsOpen(false);
                          })
                      }
                      className="margin-right-1"
                    >
                      {t('startReviewModal.startReview')}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStartReviewModalIsOpen(false)}
                      unstyled
                    >
                      {t('Go back')}
                    </Button>
                  </ButtonGroup>
                </ModalFooter>
              </Modal>
            )
          }

          <div className="padding-bottom-4" id="grbReview">
            <PageHeading className="margin-y-0">{t('title')}</PageHeading>
            <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-3">
              {t('description')}
            </p>
            {/* Feature in progress alert */}
            <Alert type="info" heading={t('featureInProgress')}>
              <Trans
                i18nKey="grbReview:featureInProgressText"
                components={{
                  a: (
                    <UswdsReactLink to="/help/send-feedback" target="_blank">
                      feedback form
                    </UswdsReactLink>
                  )
                }}
              />
            </Alert>
            {grbReviewStartedAt && (
              <p className="bg-primary-lighter line-height-body-5 padding-y-1 padding-x-2">
                <Trans
                  i18nKey="grbReview:reviewStartedOn"
                  components={{
                    date: formatDateLocal(grbReviewStartedAt, 'MM/dd/yyyy')
                  }}
                />
              </p>
            )}
            {
              // Only show button if user is admin and review has not been started
              !grbReviewStartedAt && isITGovAdmin && (
                <Button
                  type="button"
                  onClick={() => setStartReviewModalIsOpen(true)}
                  className="margin-top-3"
                  id="startGrbReview"
                >
                  {t('startGrbReview')}
                </Button>
              )
            }
            {/* Supporting Docs text */}
            <h2 className="margin-bottom-0 margin-top-6" id="documents">
              {t('supportingDocuments')}
            </h2>
            <p className="margin-top-05 line-height-body-5">
              {t('supportingDocumentsText')}
            </p>

            {/* Asynchronous presentation */}
            <div className="usa-card__container margin-left-0 border-width-1px shadow-2 margin-top-3 margin-bottom-4">
              <CardHeader>
                <h3 className="display-inline-block margin-right-2 margin-bottom-0">
                  {t('asyncPresentation.title')}
                </h3>
              </CardHeader>
              <CardBody>
                {isEmptyAdmin ? (
                  <>
                    <Alert type="info" slim className="margin-bottom-1">
                      {t('asyncPresentation.adminEmptyAlert')}
                    </Alert>
                    <div className="margin-top-2 margin-bottom-neg-2">
                      {/*
                      <Button
                        type="button"
                        unstyled
                        className="margin-right-2 display-flex flex-align-center"
                        onClick={() => {
                          setIsEmptyAdmin(false);
                        }}
                      >
                        <Icon.Add className="margin-right-1" />
                        {t(
                          'asyncPresentation.addAsynchronousPresentationLinks'
                        )}
                      </Button>
                      */}
                      <IconLink
                        icon={<Icon.Add className="margin-right-1" />}
                        to={`/it-governance/${id}/grb-review/presentation-links`}
                      >
                        {t(
                          'asyncPresentation.addAsynchronousPresentationLinks'
                        )}
                      </IconLink>
                    </div>
                  </>
                ) : (
                  <div className="margin-top-neg-1">
                    {/*
                    <Button type="button" unstyled className="margin-right-2">
                      {t('asyncPresentation.editPresentationLinks')}
                    </Button>
                    */}
                    <UswdsReactLink
                      className="margin-right-2"
                      to={`/it-governance/${id}/grb-review/presentation-links`}
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
                        <Button
                          type="button"
                          unstyled
                          className="margin-right-2 display-flex flex-align-center"
                        >
                          {t('asyncPresentation.viewRecording')}
                          <Icon.Launch className="margin-left-05" />
                        </Button>
                      )}
                      {grbPresentationLinks?.recordingPasscode && (
                        <span className="text-base margin-right-2">
                          {t('asyncPresentation.passcode', {
                            passcode: grbPresentationLinks.recordingPasscode
                          })}
                        </span>
                      )}
                      {grbPresentationLinks &&
                        grbPresentationLinks.transcriptFileStatus &&
                        grbPresentationLinks.transcriptFileURL && (
                          <Button
                            type="button"
                            unstyled
                            className="margin-right-2"
                          >
                            {t('asyncPresentation.viewTranscript')}
                          </Button>
                        )}
                      {grbPresentationLinks &&
                        grbPresentationLinks.presentationDeckFileStatus &&
                        grbPresentationLinks.presentationDeckFileURL && (
                          <Button
                            type="button"
                            unstyled
                            className="margin-right-2"
                          >
                            {t('asyncPresentation.viewSlideDeck')}
                          </Button>
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

            {/* Business Case Card */}
            <div className="usa-card__container margin-left-0 border-width-1px shadow-2 margin-top-3 margin-bottom-4">
              <CardHeader>
                <h3 className="display-inline-block margin-right-2 margin-bottom-0">
                  {t('businessCaseOverview.title')}
                </h3>
                {/* TODO: update these checks to use submittedAt when implemented */}
                {businessCase.id && businessCase.updatedAt && (
                  <span className="text-base display-inline-block">
                    {t('businessCaseOverview.submitted')}{' '}
                    {formatDateLocal(businessCase.updatedAt, 'MM/dd/yyyy')}
                  </span>
                )}
              </CardHeader>
              {businessCase.id && businessCase.businessNeed ? (
                <>
                  <CardBody>
                    <DescriptionList>
                      <DescriptionTerm
                        term={t('businessCaseOverview.need')}
                        className="margin-bottom-0"
                      />
                      <DescriptionDefinition
                        definition={businessCase.businessNeed}
                        className="text-light font-body-md line-height-body-4"
                      />

                      <DescriptionTerm
                        term={t('businessCaseOverview.preferredSolution')}
                        className="margin-bottom-0 margin-top-2"
                      />
                      <DescriptionDefinition
                        definition={
                          businessCase?.preferredSolution?.summary ||
                          t('businessCaseOverview.noSolution')
                        }
                        className="text-light font-body-md line-height-body-4"
                      />
                    </DescriptionList>
                  </CardBody>
                  <CardFooter>
                    <UswdsReactLink
                      to="./business-case"
                      className="display-flex flex-row flex-align-center"
                    >
                      <span className="margin-right-1">
                        {t('businessCaseOverview.linkToBusinessCase')}
                      </span>
                      <Icon.ArrowForward />
                    </UswdsReactLink>
                  </CardFooter>
                </>
              ) : (
                <CardBody>
                  <Alert type="info" slim>
                    {t('businessCaseOverview.unsubmittedAlertText')}
                  </Alert>
                </CardBody>
              )}
            </div>

            {/* Additional Documents Title and Link */}
            <h3 className="margin-bottom-1">{t('additionalDocuments')}</h3>

            {isITGovAdmin && (
              <UswdsReactLink
                to="./documents/upload"
                className="display-flex flex-align-center"
              >
                <Icon.Add className="margin-right-1" />
                <span>{t('additionalDocsLink')}</span>
              </UswdsReactLink>
            )}
            {/* Intake Request Link */}
            <p className="usa-card__container margin-x-0 padding-x-2 padding-y-1 display-inline-flex flex-row flex-wrap border-width-1px">
              <span className="margin-right-1">
                {t('documentsIntakeLinkTitle')}
              </span>
              <span className="margin-right-1 text-base">
                ({t('documentsIntakeSubmitted')}{' '}
                {formatDateLocal(submittedAt, 'MM/dd/yyyy')})
              </span>
              <UswdsReactLink to="./intake-request">
                {t('documentsIntakeLinkText')}
              </UswdsReactLink>
            </p>
            <DocumentsTable systemIntakeId={id} documents={documents} />
            <Discussions
              systemIntakeID={id}
              grbReviewers={grbReviewers}
              className="margin-top-4 margin-bottom-6"
            />
            <ParticipantsTable
              id={id}
              state={state}
              grbReviewers={grbReviewers}
              setReviewerToRemove={setReviewerToRemove}
              grbReviewStartedAt={grbReviewStartedAt}
            />
          </div>
        </>
      )}
    </>
  );
};

export default GRBReview;
