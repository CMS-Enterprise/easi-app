import React from 'react';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import BreadcrumbNav from 'components/BreadcrumbNav';
import CollapsableLink from 'components/shared/CollapsableLink';
import './index.scss';

type NumberedListItemProps = {
  stepName: string;
  header: string;
  body: string;
};

const NumberedListContinuingItem = ({
  stepName,
  header,
  body
}: NumberedListItemProps) => {
  return (
    <div className="easi-governance-overview__numbered-list-item">
      <div className="easi-governance-overview__list-item-continuing">
        <span className="easi-governance-overview__dot">{stepName}</span>
      </div>
      <div className="margin-top-05 margin-left-1 margin-bottom-3 tablet:margin-bottom-4">
        <p className="text-bold margin-top-0 margin-bottom-05">{header}</p>
        <p className="margin-bottom-0 line-height-body-4 margin-top-2px">
          {body}
        </p>
      </div>
    </div>
  );
};

const NumberedListTerminalItem = ({
  stepName,
  header,
  body
}: NumberedListItemProps) => {
  return (
    <div className="easi-governance-overview__numbered-list-item">
      <div className="easi-governance-overview__list-item-terminal">
        <span className="easi-governance-overview__dot">{stepName}</span>
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

const GovernanceOverview = () => {
  return (
    <div className="easi-governance-overview">
      <Header />
      <MainContent className="grid-container">
        <BreadcrumbNav className="margin-y-2">
          <li>
            <Link to="/">Home</Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li>
            <Link to="/governance-overview" aria-current="location">
              Add a new system or service
            </Link>
          </li>
        </BreadcrumbNav>
        <Link to="/">
          <i className="fa fa-angle-left margin-right-05 text-no-underline" />
          <span>Back</span>
        </Link>
        <h1 className="font-heading-2xl margin-top-4">
          Add a new system or service
        </h1>
        <p className="line-height-body-5 font-body-lg text-light">
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
            work with Subject Matter Experts (SMEs) to refine your business case
          </li>
          <li>get a Lifecycle ID</li>
          <li>get approval for your request to then seek funding</li>
        </ul>
        <span>
          It can take between 4 to 6 weeks to go through all the steps and get a
          decision.
        </span>
        <div className="tablet:grid-col-6">
          <h1 className="font-heading-xl">Steps in the governance process</h1>
          <NumberedListContinuingItem
            stepName="1"
            header="Fill the intake request form"
            body="Tell the Governance admin team about your project/ idea."
          />
          <NumberedListTerminalItem
            stepName="2"
            header="Feedback from initial review"
            body="The Governance admin team will review your intake request form and decide if it it needs further governance. If it does, they’ll direct you to go through the remaining steps."
          />
          <hr className="margin-y-3" />
          <NumberedListContinuingItem
            stepName="3"
            header="Prepare your business case"
            body="Draft different solutions and the corresponding costs involved."
          />
          <NumberedListContinuingItem
            stepName="4"
            header="Attend the Governance Review Team meeting"
            body="Discuss your draft business case with Governance Review Team. They will help you refine your business case into the best shape possible."
          />
          <NumberedListContinuingItem
            stepName="5"
            header="Feedback from the Governance Review Team"
            body="If the Governance Review Team has any additional comments, they will ask you to update your business case before it’s submitted to the Governance Review Board."
          />
          <NumberedListContinuingItem
            stepName="6"
            header="Submit the business case for final approval"
            body="Update the business case based on feedback from the review meeting and submit it to the Governance Review Board."
          />
          <NumberedListContinuingItem
            stepName="7"
            header="Attend the Governance Review Board Meeting"
            body="The Governance Review Board will discuss and make decisions based on the business case and recommendations from the Governance Review Team."
          />
          <NumberedListTerminalItem
            stepName="8"
            header="Decision and next steps"
            body="If your business case is approved you will receive a unique Lifecycle ID. If it is not approved, you would need address the concerns to proceed."
          />
        </div>
        <div className="margin-top-6 margin-bottom-7">
          <CollapsableLink
            id="GovernanceOverview-WhyGovernanceExists"
            label="Why does the governance process exist?"
          >
            <>
              These steps make sure
              <ul className="margin-bottom-0 margin-top-1 padding-left-205 line-height-body-5">
                <li>your request fits into current CMS IT strategy</li>
                <li>to avoid duplicate solutions that already exists at CMS</li>
                <li>you have considered various solutions</li>
                <li>CMS meets various policies and remains compliant</li>
              </ul>
            </>
          </CollapsableLink>
        </div>
        <UswdsLink
          className="usa-button"
          asCustom={Link}
          variant="unstyled"
          to="/system/new"
        >
          Get started
        </UswdsLink>
      </MainContent>
    </div>
  );
};

export default GovernanceOverview;
