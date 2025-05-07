import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavHashLink } from 'react-router-hash-link';
import { Button, Icon } from '@trussworks/react-uswds';
import DocumentsTable from 'features/ITGovernance/_components/DocumentsTable';
import {
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewStandardStatusType,
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
    governanceRequestFeedbacks
  } = systemIntake;

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

  const { grbReviewStartedAt, grbReviewAsyncStatus, grbReviewStandardStatus } =
    grbReview || {};

  const { euaId } = useSelector((appState: AppState) => appState.auth);

  const currentGRBReviewer = grbReview?.grbVotingInformation?.grbReviewers.find(
    reviewer =>
      reviewer.userAccount.username === euaId &&
      reviewer.votingRole === SystemIntakeGRBReviewerVotingRole.VOTING
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
        <GRBReviewAdminTask
          isITGovAdmin={isITGovAdmin}
          systemIntakeId={id}
          grbReviewStartedAt={grbReview.grbReviewStartedAt}
          grbReviewReminderLastSent={grbReview.grbReviewReminderLastSent}
          grbReviewers={grbReviewers}
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
        {/* GRB Review Status */}
        <GRBReviewStatusCard grbReview={grbReview} />
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
        {/* Presentation Links */}
        <PresentationLinksCard
          systemIntakeID={id}
          grbPresentationLinks={grbReview.grbPresentationLinks}
          asyncStatus={grbReview.grbReviewAsyncStatus}
        />
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
          grbReview.grbReviewAsyncStatus !==
            SystemIntakeGRBReviewAsyncStatusType.COMPLETED ? (
            <UswdsReactLink
              to="./documents/upload"
              className="display-flex flex-align-center"
            >
              <Icon.Add className="margin-right-1" />
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
          )}
        </div>
        {/* GRB Documents */}
        <DocumentsTable
          systemIntakeId={id}
          documents={grbReview.documents}
          asyncStatus={grbReview.grbReviewAsyncStatus}
        />

        {/* Discussion Board */}
        <Discussions
          systemIntakeID={id}
          grbReviewStartedAt={grbReview.grbReviewStartedAt}
          className="margin-top-4 margin-bottom-6"
          // Make discussions read only when review is completed
          readOnly={
            grbReviewAsyncStatus ===
              SystemIntakeGRBReviewAsyncStatusType.COMPLETED ||
            grbReviewStandardStatus ===
              SystemIntakeGRBReviewStandardStatusType.COMPLETED
          }
        />
        {/* Participants Table */}
        <ParticipantsSection
          id={id}
          state={state}
          grbReviewers={grbReview.grbVotingInformation?.grbReviewers}
          grbReviewStartedAt={grbReview.grbReviewStartedAt}
          asyncStatus={grbReview.grbReviewAsyncStatus}
        />
      </div>
    </>
  );
};

export default GRBReview;
