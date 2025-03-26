import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
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
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerVotingRole,
  useDeleteSystemIntakeGRBReviewerMutation,
  useGetSystemIntakeGRBReviewQuery,
  useStartGRBReviewMutation
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

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
import DecisionRecordCard from './DecisionRecordCard';
import Discussions from './Discussions';
import GRBReviewAdminTask from './GRBReviewAdminTask';
import GRBReviewerForm from './GRBReviewerForm';
import GRBReviewStatusCard, { GRBReviewStatus } from './GRBReviewStatusCard';
import GRBVotingPanel from './GRBVotingPanel';
import IntakeRequestCard from './IntakeRequestCard';

import './index.scss';

type GRBReviewProps = {
  systemIntake: SystemIntakeFragmentFragment;
  businessCase: BusinessCaseModel;
};

const GRBReview = ({ systemIntake, businessCase }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');

  const history = useHistory();

  const { action } = useParams<{
    action?: GRBReviewFormAction;
  }>();

  const {
    id,
    currentStage,
    state,
    submittedAt,
    annualSpending,
    governanceRequestFeedbacks
  } = systemIntake;

  const { data } = useGetSystemIntakeGRBReviewQuery({
    variables: {
      id
    }
  });

  const grbReview = useMemo(() => {
    return data?.systemIntake;
  }, [data?.systemIntake]);

  const isForm = !!action;
  const isFromGRBSetup = history.location.search === '?from-grb-setup';

  const [reviewerToRemove, setReviewerToRemove] =
    useState<SystemIntakeGRBReviewerFragment | null>(null);

  const [startReviewModalIsOpen, setStartReviewModalIsOpen] =
    useState<boolean>(false);

  const { showMessage } = useMessage();

  const { euaId } = useSelector((appState: AppState) => appState.auth);

  const currentGRBReviewer = grbReview?.grbVotingInformation?.grbReviewers.find(
    reviewer =>
      reviewer.userAccount.username === euaId &&
      reviewer.votingRole === SystemIntakeGRBReviewerVotingRole.VOTING
  );

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

  if (!grbReview) {
    return null;
  }

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
          initialGRBReviewers={grbReview.grbVotingInformation?.grbReviewers}
          grbReviewStartedAt={grbReview.grbReviewStartedAt}
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
                  {t('startReviewModal.text', {
                    count: grbReview.grbVotingInformation?.grbReviewers.length
                  })}
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
              grbReviewStartedAt={grbReview.grbReviewStartedAt}
            />

            {/* GRB Reviewer Voting Panel */}
            {/* TODO: Add grbReviewStartedAt once work is done to start review */}
            {/* {!isITGovAdmin && grbReviewStartedAt && currentGRBReviewer && ( */}
            {!isITGovAdmin && currentGRBReviewer && (
              <GRBVotingPanel grbReviewer={currentGRBReviewer} />
            )}

            {/* Review details */}
            <h2 className="margin-bottom-0 margin-top-6" id="details">
              {t('reviewDetails.title')}
            </h2>
            <p className="margin-top-05 line-height-body-5">
              {t('reviewDetails.text')}
            </p>

            <GRBReviewStatusCard
              grbReviewType={grbReview.grbReviewType}
              grbDate={grbReview.grbDate}
              grbReviewStatus={GRBReviewStatus.SCHEDULED}
              grbReviewStartedAt={grbReview.grbReviewStartedAt}
            />

            <DecisionRecordCard
              grbVotingInformation={grbReview.grbVotingInformation}
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
              grbPresentationLinks={grbReview.grbPresentationLinks}
            />

            {/* Business Case Card */}
            <BusinessCaseCard businessCase={businessCase} systemIntakeID={id} />

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

            <DocumentsTable
              systemIntakeId={id}
              documents={grbReview.documents}
            />

            <Discussions
              systemIntakeID={id}
              grbReviewers={grbReview.grbVotingInformation?.grbReviewers}
              grbReviewStartedAt={grbReview.grbReviewStartedAt}
              className="margin-top-4 margin-bottom-6"
            />

            <ParticipantsSection
              id={id}
              state={state}
              grbReviewers={grbReview.grbVotingInformation?.grbReviewers}
              grbReviewStartedAt={grbReview.grbReviewStartedAt}
            />
          </div>
        </>
      )}
    </>
  );
};

export default GRBReview;
