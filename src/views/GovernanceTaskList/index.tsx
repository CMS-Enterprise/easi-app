import React, { useEffect } from 'react';
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
import { businessCaseTag, initialReviewTag, intakeTag } from 'data/taskList';
import { AppState } from 'reducers/rootReducer';
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
          data-testid="intake-view-link"
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

type BusinessCaseLinkProps = {
  systemIntake: SystemIntakeForm;
};

const BusinessCaseLink = ({ systemIntake }: BusinessCaseLinkProps) => {
  const history = useHistory();
  switch (systemIntake.status) {
    case 'NEED_BIZ_CASE':
      return (
        <Button
          type="button"
          onClick={() => {
            history.push({
              pathname: '/business/new/general-request-info',
              state: {
                systemIntakeId: systemIntake.id
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
          data-testid="continue-biz-case-btn"
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/business/${systemIntake.businessCaseId}/general-request-info`}
        >
          Continue
        </UswdsLink>
      );
    case 'BIZ_CASE_DRAFT_SUBMITTED':
      return (
        <UswdsLink
          data-testid="view-biz-case-link"
          variant="unstyled"
          asCustom={Link}
          to={`/business/${systemIntake.businessCaseId}/view`}
        >
          View submitted draft business case
        </UswdsLink>
      );
    case 'BIZ_CASE_CHANGES_NEEDED':
      return (
        <UswdsLink
          data-testid="update-biz-case-draft"
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/business/${systemIntake.businessCaseId}/general-request-info`}
        >
          Update draft business case
        </UswdsLink>
      );
    default:
      return <></>;
  }
};

const GovernanceTaskList = () => {
  const { systemId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
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
                data-testid="task-list-intake-form"
                heading="Fill in the request form"
                description="Tell the Governance Admin Team about your idea. This step lets CMS build
              context about your request and start preparing for discussions with your team."
                status={intakeTag(systemIntake.status)}
              >
                <IntakeLink intake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                data-testid="task-list-intake-review"
                heading="Feedback from initial review"
                description="The Governance Admin Team will review your request and decide if it
              needs further governance. If it does, they’ll direct you to go through
              the remaining steps."
                status={initialReviewTag(systemIntake.status)}
              >
                {['NOT_IT_REQUEST', 'LCID_ISSUED'].includes(
                  systemIntake.status
                ) && (
                  <Alert type="info" slim>
                    Please check your email for feedback and next steps.
                  </Alert>
                )}
              </TaskListItem>
              <TaskListItem
                data-testid="task-list-business-case-draft"
                heading="Prepare your Business Case for the GRT"
                description={getBusinessCaseDescription()}
                status={businessCaseTag(systemIntake.status)}
              >
                <BusinessCaseLink systemIntake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                heading="Submit the business case for final approval"
                description="Update the Business Case based on feedback from the review meeting and
              submit it to the Governance Review Board."
                status="CANNOT_START"
              />
              <TaskListItem
                heading="Attend the GRB meeting"
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
