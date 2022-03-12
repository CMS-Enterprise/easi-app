import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconExpandLess, IconExpandMore } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

const SubNav = () => {
  const [isSubNavOpen, setIsSubNavOpen] = useState<boolean>(false);

  return (
    <div className="easi-grt__subNav-accordion">
      <button
        type="button"
        className="usa-menu-btn easi-header__basic width-full"
        onClick={() => setIsSubNavOpen(!isSubNavOpen)}
      >
        <h3 className="padding-left-1">To be Determined</h3>
        {!isSubNavOpen ? (
          <IconExpandMore size={3} />
        ) : (
          <IconExpandLess size={3} />
        )}
      </button>
      {isSubNavOpen && (
        <nav className="easi-grt__subNav__content">
          <ul className="easi-grt__subNav__list">
            <NavLink
              to="/governance-review-team/3/intake-request"
              key="/governance-review-team/3/intake-request"
              // onClick={() => setisMobileSubNavExpanded(false)}
              activeClassName="usa-current"
              className={classNames({
                'nav-group-border': false
              })}
            >
              general:intake
            </NavLink>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SubNav;
