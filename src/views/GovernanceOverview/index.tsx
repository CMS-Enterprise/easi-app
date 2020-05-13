import React from 'react';
import Header from 'components/Header';

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
      </main>
    </div>
  );
};

export default GovernanceOverview;
