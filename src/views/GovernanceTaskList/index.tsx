import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Alert, Button, Link as UswdsLink } from '@trussworks/react-uswds';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { isIntakeStarted } from 'data/systemIntake';
import {
  bizCaseStatus,
  feedbackStatusFromIntakeStatus,
  intakeStatusFromIntake
} from 'data/taskList';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import {
  archiveSystemIntake,
  fetchBusinessCase,
  fetchSystemIntake
} from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

import SideNavActions from './SideNavActions';
import TaskListItem from './TaskListItem';

import './index.scss';

const IntakeLink = ({ intake }: { intake: SystemIntakeForm }) => {
  switch (intake.status) {
    case 'INTAKE_SUBMITTED':
      return (
        <UswdsLink
          variant="unstyled"
          asCustom={Link}
          to={`/system/${intake.id}/view`}
        >
          View Submitted Request Form
        </UswdsLink>
      );
    case 'INTAKE_DRAFT':
      if (isIntakeStarted(intake)) {
        return (
          <UswdsLink
            className="usa-button"
            variant="unstyled"
            asCustom={Link}
            to={`/system/${intake.id}/contact-details`}
          >
            Continue
          </UswdsLink>
        );
      }
      return (
        <UswdsLink
          data-testid="intake-start-btn"
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/system/${intake.id || 'new'}/contact-details`}
        >
          Start
        </UswdsLink>
      );
    default:
      return <></>;
  }
};

const intakeFeedbackBannerComponent = (systemIntakeStatus: string) => {
  if (
    systemIntakeStatus === 'NOT_IT_REQUEST' ||
    systemIntakeStatus === 'LCID_ISSUED'
  ) {
    return (
      <Alert type="info" slim>
        Please check your email for feedback and next steps.
      </Alert>
    );
  }
  return null;
};

type businessCaseLinkComponentProps = {
  businessCase: BusinessCaseModel;
  systemIntakeId: string;
  businessCaseStatus: string;
  history: any;
};

/* eslint-disable react/prop-types */
const businessCaseLinkComponent = ({
  businessCase,
  systemIntakeId,
  businessCaseStatus,
  history
}: businessCaseLinkComponentProps) => {
  switch (businessCaseStatus) {
    case 'START':
      return (
        <Button
          type="button"
          onClick={() => {
            history.push({
              pathname: '/business/new/general-request-info',
              state: {
                systemIntakeId
              }
            });
          }}
          className="usa-button"
          data-testid="start-biz-case-btn"
        >
          Start
        </Button>
      );
    case 'BIZ_CASE_DRAFT':
      return (
        <UswdsLink
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/business/${businessCase.id}/general-request-info`}
        >
          Continue
        </UswdsLink>
      );
    case 'BIZ_CASE_DRAFT_SUBMITTED':
      return (
        <UswdsLink
          variant="unstyled"
          asCustom={Link}
          to={`/business/${businessCase.id}/view`}
        >
          View submitted draft business case
        </UswdsLink>
      );
    case 'BIZ_CASE_CHANGES_NEEDED':
      return (
        <UswdsLink
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/business/${businessCase.id}/general-request-info`}
        >
          Update draft business case
        </UswdsLink>
      );
    default:
      return null;
  }
};
/* eslint-enable react/prop-types */

const GovernanceTaskList = () => {
  const { systemId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [displayRemainingSteps, setDisplayRemainingSteps] = useState(false);
  const { t } = useTranslation();
  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  useEffect(() => {
    if (systemId !== 'new') {
      dispatch(fetchSystemIntake(systemId));
    }
  }, [dispatch, systemId]);

  useEffect(() => {
    if (systemId === 'new' && systemIntake.id) {
      history.replace(`/governance-task-list/${systemIntake.id}`);
    }
  }, [history, systemIntake.id, systemId]);

  useEffect(() => {
    if (systemIntake.id && systemIntake.businessCaseId) {
      dispatch(fetchBusinessCase(systemIntake.businessCaseId));
    }
  }, [dispatch, systemIntake.id, systemIntake.businessCaseId]);
  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  const intakeStatus = intakeStatusFromIntake(systemIntake);

  const intakeFeedbackStatus = feedbackStatusFromIntakeStatus(
    systemIntake.status
  );
  const intakeFeedbackBanner = intakeFeedbackBannerComponent(
    systemIntake.status
  );

  const businessCaseStatus = bizCaseStatus(systemIntake.status, businessCase);
  const businessCaseLink = businessCaseLinkComponent({
    businessCase,
    systemIntakeId: systemIntake.id,
    businessCaseStatus,
    history
  });

  const archiveIntake = () => {
    const redirect = () => {
      history.push('/', {
        confirmationText: t('taskList:withdraw_modal:confirmationText', {
          requestName: systemIntake.requestName
        })
      });
    };
    dispatch(archiveSystemIntake({ intakeId: systemId, redirect }));
  };

  const getBusinessCaseDescription = () => {
    switch (systemIntake.status) {
      case 'BIZ_CASE_DRAFT_SUBMITTED':
        return 'Status: Business case submitted. Waiting for feedback.';
      case 'BIZ_CASE_CHANGES_NEEDED':
        return 'Status: Read feedback in your email, make updates to your business case and re-submit it.';
      default:
        return 'Make a draft about the various solutions you’ve thought of and costs involved. After you’ve completed your draft business case you will likely attend the GRT meeting.';
    }
  };
  return (
    <PageWrapper className="governance-task-list">
      <Header />
      <MainContent className="grid-container margin-bottom-7">
        <div className="grid-row">
          <BreadcrumbNav className="margin-y-2 tablet:grid-col-12">
            <li>
              <Link to="/">Home</Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>
              <Link to="/governance-task-list" aria-current="location">
                Get governance approval
              </Link>
            </li>
          </BreadcrumbNav>
        </div>
        <div className="grid-row">
          <div className="tablet:grid-col-9">
            <h1 className="font-heading-2xl margin-top-4">
              Get governance approval
              {systemIntake.requestName && (
                <span className="display-block line-height-body-5 font-body-lg text-light">
                  {`for ${systemIntake.requestName}`}
                </span>
              )}
            </h1>
            <ol className="governance-task-list__task-list governance-task-list__task-list--primary">
              <TaskListItem
                heading="Fill in the request form"
                description="Tell the Governance Admin Team about your idea. This step lets CMS build
              context about your request and start preparing for discussions with your team."
                status={intakeStatus}
              >
                <IntakeLink intake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                heading="Feedback from initial review"
                description="The Governance Admin Team will review your request and decide if it
              needs further governance. If it does, they’ll direct you to go through
              the remaining steps."
                status={intakeFeedbackStatus}
              >
                {intakeFeedbackBanner}
              </TaskListItem>
              <TaskListItem
                heading="Prepare your Business Case"
                description={getBusinessCaseDescription()}
                status={businessCaseStatus}
              >
                {businessCaseLink}
              </TaskListItem>
            </ol>

            <Alert type="info">
              The following steps will be temporarily managed outside of EASi.
              Please get in touch with the governance admin team [email] if you
              have any questions about your process.
            </Alert>

            <Button
              type="button"
              className="margin-y-2"
              onClick={() => setDisplayRemainingSteps(prev => !prev)}
              aria-expanded={displayRemainingSteps}
              aria-controls="GovernanceTaskList-SecondaryList"
              data-testid="remaining-steps-btn"
              unstyled
            >
              {displayRemainingSteps ? 'Hide' : 'Show'} remaining steps
            </Button>

            {displayRemainingSteps && (
              <ol
                id="GovernanceTaskList-SecondaryList"
                className="governance-task-list__task-list governance-task-list__task-list--secondary"
                start={4}
              >
                <TaskListItem
                  heading="Attend the review meeting"
                  description="Discuss your draft Business Case with Governance Review Team. They will
              help you refine and make your business case in the best shape possible."
                  status="CANNOT_START"
                />
                <TaskListItem
                  heading="Feedback from the Review Team"
                  description="If the Review Team has any additional comments, they will ask you to
              update your business case before it’s submitted to the Review Board."
                  status="CANNOT_START"
                />
                <TaskListItem
                  heading="Submit the business case for final approval"
                  description="Update the Business Case based on feedback from the review meeting and
              submit it to the Governance Review Board."
                  status="CANNOT_START"
                />
                <TaskListItem
                  heading="Attend the board meeting"
                  description="The Governance Review Board will discuss and make decisions based on the
              Business Case and recommendations from the Review Team."
                  status="CANNOT_START"
                />
                <TaskListItem
                  heading="Decision and next steps"
                  description="If your Business Case is approved you will receive a unique Lifecycle
              ID. If it is not approved, you would need address the concerns to
              proceed."
                  status="CANNOT_START"
                />
              </ol>
            )}
          </div>
          <div className="tablet:grid-col-1" />
          <div className="tablet:grid-col-2">
            <SideNavActions archiveIntake={archiveIntake} />
          </div>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default GovernanceTaskList;
