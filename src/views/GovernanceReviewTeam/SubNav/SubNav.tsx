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
        <nav className="easi-grt__subNav__list-container">
          <ul className="easi-grt__subNav__list subNav">
            <li>
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
            </li>
            <li>
              <NavLink
                to="/governance-review-team/3/intake-request"
                key="/governance-review-team/3/intake-request"
                // onClick={() => setisMobileSubNavExpanded(false)}
                activeClassName="subNav--current"
                className="subNav--current"
              >
                general:intake
              </NavLink>
            </li>
            <li className="subNav__item--group-border">
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
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SubNav;
