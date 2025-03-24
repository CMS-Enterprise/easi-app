import React, { useCallback, useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Icon,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import DocumentsTable from 'features/ITGovernance/_components/DocumentsTable';
import {
  GetSystemIntakeGRBReviewDocument,
  SystemIntakeDocumentFragmentFragment,
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeState,
  useDeleteSystemIntakeGRBReviewerMutation,
  useStartGRBReviewMutation
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
import { BusinessCaseModel } from 'types/businessCase';
import { GRBReviewFormAction } from 'types/grbReview';

import ITGovAdminContext from '../../../../wrappers/ITGovAdminContext/ITGovAdminContext';

import GRBFeedbackCard from './GRBFeedbackCard/GRBFeedbackCard';
import ParticipantsSection from './ParticipantsSection/ParticipantsSection';
import PresentationLinksCard from './PresentationLinksCard/PresentationLinksCard';
import BusinessCaseCard from './BusinessCaseCard';
import Discussions from './Discussions';
import GRBReviewAdminTask from './GRBReviewAdminTask';
import GRBReviewerForm from './GRBReviewerForm';
import GRBReviewStatusCard, { GRBReviewStatus } from './GRBReviewStatusCard';
import IntakeRequestCard from './IntakeRequestCard';

import './index.scss';

type GRBReviewProps = {
  id: string;
  submittedAt?: string | null;
  state: SystemIntakeState;
  businessCase: BusinessCaseModel;
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  documents: SystemIntakeDocumentFragmentFragment[];
  grbReviewStartedAt?: string | null;
  grbPresentationLinks?: SystemIntakeFragmentFragment['grbPresentationLinks'];
  governanceRequestFeedbacks: SystemIntakeFragmentFragment['governanceRequestFeedbacks'];
  grbReviewType: SystemIntakeFragmentFragment['grbReviewType'];
  grbDate?: SystemIntakeFragmentFragment['grbDate'];
  currentStage?: SystemIntakeFragmentFragment['currentStage'];
  annualSpending?: SystemIntakeFragmentFragment['annualSpending'];
};

const GRBReview = ({
  id,
  businessCase,
  submittedAt,
  state,
  grbReviewers,
  documents,
  grbReviewStartedAt,
  grbPresentationLinks,
  governanceRequestFeedbacks,
  grbReviewType,
  grbDate,
  currentStage,
  annualSpending
}: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');

  const history = useHistory();

  const { action } = useParams<{
    action?: GRBReviewFormAction;
  }>();

  const isForm = !!action;
  const isFromGRBSetup = history.location.search === '?from-grb-setup';

  const [reviewerToRemove, setReviewerToRemove] =
    useState<SystemIntakeGRBReviewerFragment | null>(null);

  const [startReviewModalIsOpen, setStartReviewModalIsOpen] =
    useState<boolean>(false);

  const { showMessage } = useMessage();

  const [mutate] = useDeleteSystemIntakeGRBReviewerMutation({
    refetchQueries: [GetSystemIntakeGRBReviewDocument]
  });

  const [startGRBReview] = useStartGRBReviewMutation({
    variables: {
      input: {
        systemIntakeID: id
      }
    },
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewDocument,
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
          isFromGRBSetup={isFromGRBSetup}
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

            {/* TODO: Remove/reuse once BE work done */}
            {/* {grbReviewStartedAt && (
              <p className="bg-primary-lighter line-height-body-5 padding-y-1 padding-x-2">
                <Trans
                  i18nKey="grbReview:reviewStartedOn"
                  components={{
                    date: formatDateLocal(grbReviewStartedAt, 'MM/dd/yyyy')
                  }}
                />
              </p>
            )} */}

            <GRBReviewAdminTask
              isITGovAdmin={isITGovAdmin}
              systemIntakeId={id}
              grbReviewStartedAt={grbReviewStartedAt}
            />

            {/* Review details */}
            <h2 className="margin-bottom-0 margin-top-6" id="details">
              {t('reviewDetails.title')}
            </h2>
            <p className="margin-top-05 line-height-body-5">
              {t('reviewDetails.text')}
            </p>

            <GRBReviewStatusCard
              grbReviewType={grbReviewType}
              grbDate={grbDate}
              grbReviewStatus={GRBReviewStatus.SCHEDULED}
              grbReviewStartedAt={grbReviewStartedAt}
            />

            {/* GRT recommendations to the GRB */}
            <GRBFeedbackCard
              systemIntakeID={id}
              governanceRequestFeedbacks={governanceRequestFeedbacks}
            />

            {/* Supporting Docs text */}
            <h2 className="margin-bottom-0 margin-top-6" id="documents">
              {t('supportingDocuments')}
            </h2>
            <p className="margin-top-05 line-height-body-5">
              {t('supportingDocumentsText')}
            </p>

            <PresentationLinksCard
              systemIntakeID={id}
              grbPresentationLinks={grbPresentationLinks}
            />

            {/* Business Case Card */}
            <BusinessCaseCard businessCase={businessCase} />

            {/* Intake Request Link */}
            <IntakeRequestCard
              currentStage={currentStage}
              annualSpending={annualSpending}
              submittedAt={submittedAt}
            />

            {/* Additional Documents Title and Link */}
            <div className="margin-y-4">
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
            </div>

            <DocumentsTable systemIntakeId={id} documents={documents} />

            <Discussions
              systemIntakeID={id}
              grbReviewers={grbReviewers}
              grbReviewStartedAt={grbReviewStartedAt}
              className="margin-top-4 margin-bottom-6"
            />

            <ParticipantsSection
              id={id}
              state={state}
              grbReviewers={grbReviewers}
              grbReviewStartedAt={grbReviewStartedAt}
            />
          </div>
        </>
      )}
    </>
  );
};

export default GRBReview;
