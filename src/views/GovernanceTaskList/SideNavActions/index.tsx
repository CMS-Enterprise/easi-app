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
        <Button type="button" unstyled onClick={() => {}}>
          Remove your request to add a new system
        </Button>
      </div>
      <div className="grid-col margin-top-5">
        <h4>Related Content</h4>
        <UswdsLink
          href="/governance-overview"
          variant="external"
          target="_blank"
        >
          Overview for adding a system
        </UswdsLink>
        <p>(opens in a new tab)</p>
      </div>
    </div>
  );
};

export default SideNavActions;
