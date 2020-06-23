import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './index.scss';
import Button from 'components/shared/Button';

type SideNavActionsProps = RouteComponentProps;

const SideNavActions = ({ history }: SideNavActionsProps) => {
  const returnHome = () => history.push('/');
  const openTabOverview = () => window.open('/governance-overview');
  return (
    <div className="sidenav-actions margin-top-4">
      <div className="sidenav-actions__main">
        <Button
          className="sidenav-actions__action"
          type="button"
          unstyled
          onClick={returnHome}
        >
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
