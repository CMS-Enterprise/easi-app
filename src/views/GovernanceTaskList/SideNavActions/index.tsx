import React from 'react';
import { withRouter } from 'react-router-dom';
import './index.scss';
import Button from 'components/shared/Button';

const SideNavActions = () => {
  const openTabOverview = () => window.open('/governance-overview');
  return (
    <div className="sidenav-actions margin-top-4">
      <div className="sidenav-actions__main">
        <Button className="sidenav-actions__action" unstyled to="/">
          <span>Save & Exit</span>
        </Button>
        <Button
          className="sidenav-actions__action"
          type="button"
          unstyled
          onClick={() => {}}
        >
          <span>Remove your request to add a new system</span>
        </Button>
      </div>
      <div className="sidenav-actions__related-content">
        <span>Related Content</span>
        <Button
          className="sidenav-actions__action"
          type="button"
          unstyled
          onClick={openTabOverview}
        >
          <span>Overview for adding a system</span>
        </Button>
        <p>(opens in a new tab)</p>
      </div>
    </div>
  );
};

export default withRouter(SideNavActions);
