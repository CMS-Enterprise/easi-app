import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';

import './index.scss';

const GovernanceOverview = () => {
  const { systemId } = useParams<{
    systemId: string;
  }>();
  return (
    <PageWrapper
      className="easi-governance-overview"
      data-testid="governance-overview"
    >
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Add a new system or service</Breadcrumb>
        </BreadcrumbBar>
        <Link to="/">
          <i className="fa fa-angle-left margin-right-05 text-no-underline" />
          <span>Back</span>
        </Link>
        <PageHeading>Add a new system or service</PageHeading>
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
          <h2 className="font-heading-xl">Steps in the governance process</h2>
          <ProcessList>
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Fill the intake request form
              </ProcessListHeading>
              <p>Tell the Governance admin team about your project/idea.</p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Feedback from initial review
              </ProcessListHeading>
              <p>
                The Governance admin team will review your intake request form
                and decide if it it needs further governance. If it does,
                they’ll direct you to go through the remaining steps.
              </p>
            </ProcessListItem>
          </ProcessList>
          <hr className="margin-y-3" />
          <ProcessList
            className="easi-governance-overview__governance-steps"
            start={3}
          >
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Prepare your business case
              </ProcessListHeading>
              <p>
                Draft different solutions and the corresponding costs involved.
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Attend the Governance Review Team meeting
              </ProcessListHeading>
              <p>
                Discuss your draft business case with Governance Review Team.
                They will help you refine your business case into the best shape
                possible.
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Feedback from the Governance Review Team
              </ProcessListHeading>
              <p>
                If the Governance Review Team has any additional comments, they
                will ask you to update your business case before it’s submitted
                to the Governance Review Board.
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Submit the business case for final approval
              </ProcessListHeading>
              <p>
                Update the business case based on feedback from the review
                meeting and submit it to the Governance Review Board.
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Attend the Governance Review Board Meeting
              </ProcessListHeading>
              <p>
                The Governance Review Board will discuss and make decisions
                based on the business case and recommendations from the
                Governance Review Team.
              </p>
            </ProcessListItem>
            <ProcessListItem>
              <ProcessListHeading type="h3">
                Decision and next steps
              </ProcessListHeading>
              <p>
                If your business case is approved you will receive a unique
                Lifecycle ID. If it is not approved, you would need address the
                concerns to proceed.
              </p>
            </ProcessListItem>
          </ProcessList>
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

        {systemId && (
          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            to={`/governance-task-list/${systemId}`}
          >
            Get started
          </UswdsReactLink>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default GovernanceOverview;
