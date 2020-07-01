import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useOktaAuth } from '@okta/okta-react';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import BreadcrumbNav from 'components/BreadcrumbNav';
import Alert from 'components/shared/Alert';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';
import TaskListItem from './TaskListItem';
import SideNavActions from './SideNavActions';
import './index.scss';

const GovernanceTaskList = () => {
  const { authState } = useOktaAuth();
  const dispatch = useDispatch();
  const [displayRemainingSteps, setDisplayRemainingSteps] = useState(false);
  const systemIntake =
    // Later this should be changed to get state.systemIntake.systemIntake
    useSelector((state: AppState) => state.systemIntakes.systemIntakes[0]) ||
    null;

  const calculateIntakeStatus = (intake: SystemIntakeForm) => {
    if (intake === null) {
      return 'START';
    }
    if (intake.status === 'DRAFT') {
      return 'CONTINUE';
    }
    return 'COMPLETED';
  };
  const intakeState = calculateIntakeStatus(systemIntake);
  const chooseIntakeLink = (intake: SystemIntakeForm, status: string) => {
    const newIntakeLink = '/system/new';
    if (intake === null) {
      return newIntakeLink;
    }
    let link: string;
    switch (status) {
      case 'CONTINUE':
        link = `/system/${intake.id}/contact-details`;
        break;
      case 'COMPLETED':
        link = '/';
        break;
      default:
        link = newIntakeLink;
    }
    return link;
  };
  const intakeLink = chooseIntakeLink(systemIntake, intakeState);

  // This is a hack to get a system intake into the state, but it will be changed later
  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchSystemIntakes());
    }
  }, [dispatch, authState.isAuthenticated]);
  return (
    <div className="governance-task-list">
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
              <span className="display-block line-height-body-5 font-body-lg text-light">
                for adding a new system or service
              </span>
            </h1>
            <ol className="governance-task-list__task-list governance-task-list__task-list--primary">
              <TaskListItem
                heading="Fill in the request form"
                description="Tell the Governance Admin Team about your idea. This step lets CMS build
              context about your request and start preparing for discussions with your team."
                status={intakeState}
                link={intakeLink}
              />
              <TaskListItem
                heading="Feedback from initial review"
                description="The Governance Admin Team will review your request and decide if it
              needs further governance. If it does, they’ll direct you to go through
              the remaining steps."
                status="CANNOT_START"
                link="/"
              />
              <TaskListItem
                heading="Prepare your Business Case"
                description="Draft different solutions and the corresponding costs involved."
                status="CANNOT_START"
                link="/"
              />
            </ol>

            <Alert type="info">
              The following steps will be temporarily managed outside of EASi.
              Please get in touch with the governance admin team [email] if you
              have any questions about your process.
            </Alert>
            <button
              type="button"
              className="governance-task-list__remaining-steps-btn"
              onClick={() => setDisplayRemainingSteps(prev => !prev)}
              aria-expanded={displayRemainingSteps}
              aria-controls="GovernanceTaskList-SecondaryList"
            >
              {displayRemainingSteps ? 'Hide' : 'Show'} remaining steps
            </button>

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
                  link="/"
                />
                <TaskListItem
                  heading="Feedback from the Review Team"
                  description="If the Review Team has any additional comments, they will ask you to
              update your business case before it’s submitted to the Review Board."
                  status="CANNOT_START"
                  link="/"
                />
                <TaskListItem
                  heading="Submit the business case for final approval"
                  description="Update the Business Case based on feedback from the review meeting and
              submit it to the Governance Review Board."
                  status="CANNOT_START"
                  link="/"
                />
                <TaskListItem
                  heading="Attend the board meeting"
                  description="The Governance Review Board will discuss and make decisions based on the
              Business Case and recommendations from the Review Team."
                  status="CANNOT_START"
                  link="/"
                />
                <TaskListItem
                  heading="Decision and next steps"
                  description="If your Business Case is approved you will receive a unique Lifecycle
              ID. If it is not approved, you would need address the concerns to
              proceed."
                  status="CANNOT_START"
                  link="/"
                />
              </ol>
            )}
          </div>
          <div className="tablet:grid-col-1" />
          <div className="tablet:grid-col-2">
            <SideNavActions />
          </div>
        </div>
      </MainContent>
    </div>
  );
};

export default GovernanceTaskList;
