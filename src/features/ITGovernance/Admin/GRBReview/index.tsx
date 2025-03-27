import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import DocumentsTable from 'features/ITGovernance/_components/DocumentsTable';
import {
  GRBVotingInformationStatus,
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewerVotingRole,
  useGetSystemIntakeGRBReviewQuery
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
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
import GRBReviewStatusCard from './GRBReviewStatusCard';
import GRBVotingPanel from './GRBVotingPanel';
import IntakeRequestCard from './IntakeRequestCard';

import './index.scss';

type GRBReviewProps = {
  systemIntake: SystemIntakeFragmentFragment;
  businessCase: BusinessCaseModel;
};

const GRBReview = ({ systemIntake, businessCase }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');

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

  const { euaId } = useSelector((appState: AppState) => appState.auth);

  const currentGRBReviewer = grbReview?.grbVotingInformation?.grbReviewers.find(
    reviewer =>
      reviewer.userAccount.username === euaId &&
      reviewer.votingRole === SystemIntakeGRBReviewerVotingRole.VOTING
  );

  const isITGovAdmin = useContext(ITGovAdminContext);

  if (!grbReview) {
    return null;
  }

  return (
    <>
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

        {/* <DecisionRecordCard
              grbVotingInformation={grbReview.grbVotingInformation}
            /> */}

        {/* TODO: Temp dummy data */}
        <DecisionRecordCard
          grbVotingInformation={{
            __typename: 'GRBVotingInformation',
            grbReviewers: [],
            numberOfNoObjection: 4,
            numberOfObjection: 1,
            numberOfNotVoted: 3,
            votingStatus: GRBVotingInformationStatus.IN_PROGRESS
          }}
        />

        {/* TODO: Temp dummy data */}
        {/* <DecisionRecordCard
              grbVotingInformation={{
                __typename: 'GRBVotingInformation',
                grbReviewers: [],
                numberOfNoObjection: 5,
                numberOfObjection: 0,
                numberOfNotVoted: 2,
                votingStatus: GRBVotingInformationStatus.APPROVED
              }}
            /> */}

        {/* TODO: Temp dummy data */}
        {/* <DecisionRecordCard
              grbVotingInformation={{
                __typename: 'GRBVotingInformation',
                grbReviewers: [],
                numberOfNoObjection: 3,
                numberOfObjection: 2,
                numberOfNotVoted: 2,
                votingStatus: GRBVotingInformationStatus.NOT_APPROVED
              }}
            /> */}

        {/* TODO: Temp dummy data */}
        {/* <DecisionRecordCard
              grbVotingInformation={{
                __typename: 'GRBVotingInformation',
                grbReviewers: [],
                numberOfNoObjection: 3,
                numberOfObjection: 0,
                numberOfNotVoted: 3,
                votingStatus: GRBVotingInformationStatus.INCONCLUSIVE
              }}
            /> */}

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

        {/* GRB Documents */}
        <DocumentsTable systemIntakeId={id} documents={grbReview.documents} />

        {/* Discussion Board */}
        <Discussions
          systemIntakeID={id}
          grbReviewers={grbReview.grbVotingInformation?.grbReviewers}
          grbReviewStartedAt={grbReview.grbReviewStartedAt}
          className="margin-top-4 margin-bottom-6"
        />

        {/* Participants Table */}
        <ParticipantsSection
          id={id}
          isForm={isForm}
          state={state}
          grbReviewers={grbReview.grbVotingInformation?.grbReviewers}
          grbReviewStartedAt={grbReview.grbReviewStartedAt}
        />
      </div>
    </>
  );
};

export default GRBReview;
