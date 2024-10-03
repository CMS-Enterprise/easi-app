import React, { useCallback, useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  CardBody,
  CardFooter,
  CardHeader,
  IconAdd,
  IconArrowForward,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewersDocument,
  SystemIntakeGRBReviewerFragment,
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
import useMessage from 'hooks/useMessage';
import { SystemIntakeDocument } from 'queries/types/SystemIntakeDocument';
import { BusinessCaseModel } from 'types/businessCase';
import { SystemIntakeState } from 'types/graphql-global-types';
import { GRBReviewFormAction } from 'types/grbReview';
import { formatDateLocal } from 'utils/date';
import DocumentsTable from 'views/SystemIntake/Documents/DocumentsTable';

import ITGovAdminContext from '../ITGovAdminContext';

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
};

const GRBReview = ({
  id,
  businessCase,
  submittedAt,
  state,
  grbReviewers,
  documents,
  grbReviewStartedAt
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

  const { showMessage } = useMessage();

  const [mutate] = useDeleteSystemIntakeGRBReviewerMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersDocument,
        variables: { id }
      }
    ]
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
            >
              success
            </Trans>,
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

          <div className="padding-bottom-4">
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
            <h2 className="margin-bottom-0 margin-top-6">
              {t('supportingDocuments')}
            </h2>
            <p className="margin-top-05 line-height-body-5">
              {t('supportingDocumentsText')}
            </p>

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
                      <IconArrowForward />
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
            <h3 className="margin-bottom-1" id="documents">
              {t('additionalDocuments')}
            </h3>

            {isITGovAdmin && (
              <UswdsReactLink
                to="./documents/upload"
                className="display-flex flex-align-center"
              >
                <IconAdd className="margin-right-1" />
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
