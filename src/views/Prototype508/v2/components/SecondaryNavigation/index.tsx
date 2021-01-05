import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import './index.scss';

const SecondaryNavigation = () => {
  const { pathname } = useLocation();
  return (
    <nav className="site-nav-secondary" aria-label="Primary">
      <ul>
        <li className="usa-nav__submenu-item">
          <Link
            to="/508/v2/requests"
            className={classNames({
              'usa-current': pathname === '/508/v2/requests'
            })}
            aria-current={pathname === '/508/v2/requests' && 'page'}
          >
            <span>Active Requests</span>
          </Link>
        </li>

        <li className="usa-nav__submenu-item">
          <Link
            to="/508/v2/remediation"
            className={classNames({
              'usa-current': pathname === '/508/v2/remediation'
            })}
            aria-current={pathname === '/508/v2/remediation' && 'page'}
          >
            <span>Remediation</span>
          </Link>
        </li>

        <li className="usa-nav__submenu-item">
          <Link
            to="/508/v2/closed"
            className={classNames({
              'usa-current': pathname === '/508/v2/closed'
            })}
            aria-current={pathname === '/508/v2/closed' && 'page'}
          >
            <span>Closed Requests</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SecondaryNavigation;
