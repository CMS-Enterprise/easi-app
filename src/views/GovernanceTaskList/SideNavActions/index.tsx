import React from 'react';
import { Link } from 'react-router-dom';
import { Link as UswdsLink, Button } from '@trussworks/react-uswds';

import './index.scss';

const SideNavActions = () => {
  return (
    <div className="sidenav-actions grid-row flex-column">
      <div className="grid-col margin-top-105">
        <Link to="/">Save & Exit</Link>
      </div>
      <div className="grid-col margin-top-2">
        {/* Leaving this a button as it will likely do more than redirect the user */}
        <Button
          className="line-height-body-5"
          type="button"
          unstyled
          onClick={() => {}}
        >
          Remove your request to add a new system
        </Button>
      </div>
      <div className="grid-col margin-top-5">
        <h4>Related Content</h4>
        <UswdsLink
          aria-label="Open overview for adding a system in a new tab"
          className="line-height-body-5"
          href="/governance-overview"
          variant="external"
          target="_blank"
        >
          Overview for adding a system
          <span aria-hidden>&nbsp;(opens in a new tab)</span>
        </UswdsLink>
      </div>
    </div>
  );
};

export default SideNavActions;
