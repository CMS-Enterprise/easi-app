import React from 'react';
import Header from 'components/Header';
import './index.scss';

const GovernanceOverview = () => {
  return (
    <div className="governance-overview">
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
        <ul className="margin-top-1 padding-left-205">
          <li>
            Get help from Subject Matter Experts (SMEs) to make an effective
            business case
          </li>
          <li>Get a lifecycle ID</li>
          <li>Get a decision on funding for your project</li>
        </ul>
      </main>
    </div>
  );
};

export default GovernanceOverview;
