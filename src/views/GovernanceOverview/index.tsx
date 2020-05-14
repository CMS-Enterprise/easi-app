import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Header from 'components/Header';
import './index.scss';
import CollapsableLink from 'components/shared/CollapsableLink';
import Button from 'components/shared/Button';

type NumberedListItemProps = {
  index: string;
  header: string;
  body: string;
};

const NumberedListContinuingItem = ({
  index,
  header,
  body
}: NumberedListItemProps) => {
  return (
    <div className="easi-governance-overview__numbered-list-item">
      <div className="easi-governance-overview__list-item-continuing">
        <span className="easi-governance-overview__dot">{index}</span>
      </div>
      <div className="margin-top-05 margin-left-1 margin-bottom-4">
        <p className="text-bold margin-top-0 margin-bottom-05">{header}</p>
        <p className="margin-bottom-0 line-height-body-4 margin-top-2px">
          {body}
        </p>
      </div>
    </div>
  );
};

const NumberedListTerminalItem = ({
  index,
  header,
  body
}: NumberedListItemProps) => {
  return (
    <div className="easi-governance-overview__numbered-list-item">
      <div className="easi-governance-overview__list-item-terminal">
        <span className="easi-governance-overview__dot">{index}</span>
      </div>
      <div className="margin-top-05 margin-left-1 margin-bottom-0">
        <p className="text-bold margin-top-0 margin-bottom-05">{header}</p>
        <p className="margin-bottom-0 line-height-body-4 margin-top-2px">
          {body}
        </p>
      </div>
    </div>
  );
};

const GovernanceOverview = ({ history }: RouteComponentProps) => {
  return (
    <div className="easi-governance-overview">
      <Header name="EASi Governance Overview" />
      <main role="main" className="grid-container">
        <p>
          <a href="/">Home</a> <i className="fa fa-angle-right" /> Add a new
          system or service
        </p>
        <p>
          {/* TODO: Make the arrow part of the link w/o underlining the space */}
          <i className="fa fa-angle-left" /> <a href="/">Back</a>
        </p>
        <h1 className="font-heading-2xl margin-top-4">
          Add a new system or service
        </h1>
        <p className="easi-governance-overview__text">
          To add a new system or service, you need to go through a set of steps
          and get approved by the Governance Review Board (GRB).
        </p>
        <div className="easi-governance-overview__indented-wrapper">
          <p className="easi-governance-overview__indented-body">
            Use this process only if you&apos;d like to add a new system,
            service or make major changes and upgrades to an existing one.
          </p>
        </div>
        <span>This step by step process will help you:</span>
        <ul className="margin-top-1 padding-left-205 line-height-body-5">
          <li>
            Get help from Subject Matter Experts (SMEs) to make an effective
            business case
          </li>
          <li>Get a lifecycle ID</li>
          <li>Get a decision on funding for your project</li>
        </ul>
        <span>
          It can take between 4 to 6 weeks to go through all the steps and get a
          decision.
        </span>
        <h1 className="font-heading-xl">Steps in the governance process</h1>
        <NumberedListContinuingItem
          index="1"
          header="Fill the intake request form"
          body="Tell the Governance admin team about your project/ idea."
        />
        <NumberedListTerminalItem
          index="2"
          header="Feedback from initial review"
          body="The Governance admin team will review your intake request form and decide if
           it needs further governance. If it does, they’ll direct you to go through the remaining steps."
        />
        <hr className="margin-y-3" />
        <NumberedListContinuingItem
          index="3"
          header="Prepare your business case"
          body="Make a first draft of your initial solutions and the corresponding costs involved."
        />
        <NumberedListContinuingItem
          index="4"
          header="Attend the Governance Review Team meeting"
          body="Discuss your draft business case with Governance Review Team. They will help you refine and make your business case in the best shape possible. "
        />
        <NumberedListContinuingItem
          index="5"
          header="Feedback from the Governance Review Team"
          body="If the Governance Review Team has any additional comments, they will ask you to update your business case before it’s submitted to the Governance Review Board."
        />
        <NumberedListContinuingItem
          index="6"
          header="Submit the business case for final approval"
          body="Update the business case based on feedback from the review meeting and submit it to the Governance Review Board."
        />
        <NumberedListContinuingItem
          index="7"
          header="Attend the Governance Review Board Meeting"
          body="The Governance Review Board will discuss and make decisions based on the business case and recommendations from the Governance Review Team."
        />
        <NumberedListTerminalItem
          index="8"
          header="Decision and next steps"
          body="If your business case is approved you will receive a unique Lifecycle ID. Depending on allocation, funding may or may not be immediately approved."
        />
        <div className="margin-top-6 margin-bottom-7">
          <CollapsableLink label="Why does the governance process exist?">
            <div>
              These steps make sure
              <ul className="margin-bottom-0">
                <li>CMS has enough budget to allocate for your project</li>
                <li>They can assist and help you consider various solutions</li>
                <li>
                  They can help your team not re-build a solution that already
                  exists at CMS
                </li>
                <li>CMS meets various policies and remains compliant</li>
              </ul>
            </div>
          </CollapsableLink>
        </div>
        <Button
          type="button"
          onClick={() => {
            history.push('/governance-overview');
          }}
        >
          Get started
        </Button>
      </main>
    </div>
  );
};

export default withRouter(GovernanceOverview);
