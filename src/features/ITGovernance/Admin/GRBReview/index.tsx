import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavHashLink } from 'react-router-hash-link';
import { Button, Icon } from '@trussworks/react-uswds';
import DocumentsTable from 'features/ITGovernance/_components/DocumentsTable';
import {
  GRBVotingInformationStatus,
  SystemIntakeDocumentStatus,
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewStandardStatusType,
  SystemIntakeGRBReviewType,
  SystemIntakeState,
  SystemIntakeStatusAdmin,
  useGetSystemIntakeGRBDiscussionsQuery,
  useGetSystemIntakeGRBReviewQuery
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { BusinessCaseModel } from 'types/businessCase';

import ITGovAdminContext from '../../../../wrappers/ITGovAdminContext/ITGovAdminContext';

import GRBFeedbackCard from './GRBFeedbackCard/GRBFeedbackCard';
import ParticipantsSection from './ParticipantsSection/ParticipantsSection';
import PresentationLinksCard from './PresentationLinksCard/PresentationLinksCard';
import { useRestartReviewModal } from './RestartReviewModal/RestartReviewModalContext';
import BusinessCaseCard from './BusinessCaseCard';
import DecisionRecordCard from './DecisionRecordCard';
import Discussions from './Discussions';
import GRBReviewAdminTask from './GRBReviewAdminTask';
import GRBReviewStatusCard from './GRBReviewStatusCard';
import GRBVotingPanel from './GRBVotingPanel';
import IntakeRequestCard from './IntakeRequestCard';
import RestartReviewModal from './RestartReviewModal';

import './index.scss';

type GRBReviewProps = {
  systemIntake: SystemIntakeFragmentFragment;
  businessCase: BusinessCaseModel;
};

const GRBReview = ({ systemIntake, businessCase }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');
  const { openModal } = useRestartReviewModal();

  const {
    id,
    currentStage,
    state,
    submittedAt,
    annualSpending,
    governanceRequestFeedbacks,
    statusAdmin
  } = systemIntake;

  const votingStatus = systemIntake.grbVotingInformation?.votingStatus;

  const isITGovAdmin = useContext(ITGovAdminContext);

  const { data: discussionsData } = useGetSystemIntakeGRBDiscussionsQuery({
    variables: { id }
  });

  const { data: grbReviewData } = useGetSystemIntakeGRBReviewQuery({
    variables: {
      id
    }
  });

  const grbReview = useMemo(() => {
    return grbReviewData?.systemIntake;
  }, [grbReviewData?.systemIntake]);

  const {
    grbReviewType,
    grbReviewStartedAt,
    grbReviewAsyncStatus,
    grbReviewStandardStatus,
    grbReviewAsyncRecordingTime,
    grbPresentationLinks
  } = grbReview || {};

  const { recordingLink, transcriptLink, presentationDeckFileURL } =
    grbPresentationLinks || {};

  const { euaId } = useSelector((appState: AppState) => appState.auth);

  const currentGRBReviewer = useMemo(
    () =>
      grbReview?.grbVotingInformation?.grbReviewers.find(
        reviewer =>
          reviewer.userAccount.username === euaId &&
          reviewer.votingRole === SystemIntakeGRBReviewerVotingRole.VOTING
      ),
    [euaId, grbReview?.grbVotingInformation?.grbReviewers]
  );

  const grbReviewers = grbReview?.grbVotingInformation?.grbReviewers || [];

  /** Merge discussions from both board types into one array */
  const grbDiscussions = useMemo(() => {
    if (!discussionsData?.systemIntake) return undefined;

    return [
      ...discussionsData.systemIntake.grbDiscussionsInternal,
      ...discussionsData.systemIntake.grbDiscussionsPrimary
    ];
  }, [discussionsData]);

  const grbDiscussionsWithoutRepliesCount: number = useMemo(() => {
    if (!grbDiscussions) return 0;

    return grbDiscussions.filter(({ replies }) => replies.length === 0).length;
  }, [grbDiscussions]);

  const hideAdminTask: boolean =
    // Form has been submitted for standard meeting
    (grbReviewStartedAt &&
      grbReviewType === SystemIntakeGRBReviewType.STANDARD) ||
    // Request is awaiting a decision, with either voting ended or meeting date passed
    statusAdmin === SystemIntakeStatusAdmin.GRB_MEETING_COMPLETE ||
    // Request has been closed or issued a decision
    state === SystemIntakeState.CLOSED;

  /** Returns true if presentation links card should render */
  const renderPresentationLinksCard = useMemo(() => {
    const hasPresentationLinks: boolean =
      !!recordingLink || !!transcriptLink || !!presentationDeckFileURL;

    // Return true if presentation links are uploaded
    if (hasPresentationLinks) return true;

    // Return false if no links and not an admin
    if (!isITGovAdmin) return false;

    // Return false if no links and standard meeting is completed
    if (
      grbReviewStandardStatus ===
      SystemIntakeGRBReviewStandardStatusType.COMPLETED
    ) {
      return false;
    }

    return true;
  }, [
    grbReviewStandardStatus,
    isITGovAdmin,
    recordingLink,
    transcriptLink,
    presentationDeckFileURL
  ]);

  const hideRemoveDocumentsButton = useMemo(() => {
    const reviewIsComplete =
      grbReviewAsyncStatus === SystemIntakeGRBReviewAsyncStatusType.COMPLETED ||
      grbReviewStandardStatus ===
        SystemIntakeGRBReviewStandardStatusType.COMPLETED;

    return reviewIsComplete || !!currentGRBReviewer;
  }, [grbReviewAsyncStatus, grbReviewStandardStatus, currentGRBReviewer]);

  if (!grbReview) {
    return null;
  }

  return (
    <>
      <RestartReviewModal systemIntakeId={id} />

      <div className="padding-bottom-4" id="grbReview">
        <PageHeading className="margin-y-0">{t('title')}</PageHeading>
        <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-3">
          {t('description')}
        </p>
        {/* GRB Admin Task */}
        {!hideAdminTask && (
          <GRBReviewAdminTask
            isITGovAdmin={isITGovAdmin}
            systemIntakeId={id}
            grbReviewStartedAt={grbReviewStartedAt}
            grbReviewReminderLastSent={grbReview.grbReviewReminderLastSent}
            grbReviewers={grbReviewers}
          />
        )}
        {/* GRB Reviewer Voting Panel */}
        {currentGRBReviewer &&
          votingStatus === GRBVotingInformationStatus.IN_PROGRESS && (
            <GRBVotingPanel grbReviewer={currentGRBReviewer} />
          )}
        {/* Review details */}
        <h2 className="margin-bottom-0 margin-top-6" id="details">
          {t('reviewDetails.title')}
        </h2>
        <p className="margin-top-05 line-height-body-5">
          {t('reviewDetails.text')}
        </p>
        {/* GRB Review Status */}
        <GRBReviewStatusCard systemIntakeId={id} grbReview={grbReview} />
        {/* Decision Record */}
        <DecisionRecordCard
          grbVotingInformation={grbReview.grbVotingInformation}
        />

        {/* Discussions summary card */}
        {grbReviewStartedAt && grbDiscussions && (
          <div className="bg-base-lightest padding-x-3 padding-y-3 margin-top-2">
            <p className="margin-top-05">
              <Trans
                i18nKey="discussions:summaryCard.title"
                components={{ span: <span className="text-bold" /> }}
                values={{
                  withoutReplies: grbDiscussionsWithoutRepliesCount
                }}
                count={grbDiscussions.length}
              />
            </p>

            <NavHashLink
              to="#discussions"
              className="usa-link display-inline-block margin-bottom-05"
            >
              {t('discussions:summaryCard.jumpToDiscussions')}
            </NavHashLink>
          </div>
        )}

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

        {/* Presentation links card */}
        {renderPresentationLinksCard && (
          <PresentationLinksCard
            systemIntakeID={id}
            grbReviewType={grbReviewType}
            grbReviewStartedAt={grbReviewStartedAt}
            grbPresentationLinks={grbReview.grbPresentationLinks}
            grbReviewAsyncStatus={grbReviewAsyncStatus}
            grbReviewStandardStatus={grbReviewStandardStatus}
            grbReviewAsyncRecordingTime={grbReviewAsyncRecordingTime}
          />
        )}
        {/* Business Case Card */}
        <BusinessCaseCard businessCase={businessCase} systemIntakeID={id} />
        {/* Intake Request Link */}
        <IntakeRequestCard
          systemIntakeID={id}
          currentStage={currentStage}
          annualSpending={annualSpending}
          submittedAt={submittedAt}
        />
        {/* Additional Documents Title and Link */}
        <div className="margin-y-4">
          <h3 className="margin-bottom-1">{t('additionalDocuments')}</h3>

          {isITGovAdmin &&
            (grbReviewAsyncStatus !==
            SystemIntakeGRBReviewAsyncStatusType.COMPLETED ? (
              <UswdsReactLink
                to="./documents/upload"
                className="display-flex flex-align-center"
              >
                <Icon.Add className="margin-right-1" aria-hidden />
                <span>{t('additionalDocsLink')}</span>
              </UswdsReactLink>
            ) : (
              <span className="text-base-dark">
                <Trans
                  i18nKey="grbReview:asyncCompleted.documents"
                  components={{
                    link1: (
                      <Button type="button" unstyled onClick={openModal}>
                        {t('restartReview')}
                      </Button>
                    )
                  }}
                />
              </span>
            ))}
        </div>
        {/* GRB Documents */}
        <DocumentsTable
          systemIntakeId={id}
          documents={grbReview.documents.map(doc => ({
            ...doc,
            status: SystemIntakeDocumentStatus.AVAILABLE
          }))}
          hideRemoveButton={hideRemoveDocumentsButton}
        />

        {/* Discussion Board */}
        <Discussions
          systemIntakeID={id}
          className="margin-top-4 margin-bottom-6"
          statusAdmin={statusAdmin}
        />
        {/* Participants Table */}
        <ParticipantsSection
          id={id}
          state={state}
          grbReviewers={grbReview.grbVotingInformation?.grbReviewers}
          asyncStatus={grbReviewAsyncStatus}
          grbReviewStandardStatus={grbReviewStandardStatus}
        />
      </div>
    </>
  );
};

export default GRBReview;
