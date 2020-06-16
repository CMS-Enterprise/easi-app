import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import BreadcrumbNav from 'components/BreadcrumbNav';
import Alert from 'components/shared/Alert';
import TaskListItem from './TaskListItem';

import './index.scss';

const GovernanceTaskList = () => {
  const [displayRemainingSteps, setDisplayRemainingSteps] = useState(false);
  return (
    <div className="governance-task-list">
      <Header />
      <MainContent className="grid-container margin-bottom-7">
        <div className="tablet:grid-col-9">
          <BreadcrumbNav className="margin-y-2">
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
              status="START"
              link="/system/new"
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
          >
            Hide remaining steps
          </button>

          {displayRemainingSteps && (
            <ol
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
      </MainContent>
    </div>
  );
};

export default GovernanceTaskList;
