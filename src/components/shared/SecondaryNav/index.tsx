import React from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

type SecondaryNavProps = {
  secondaryNavList?: any[];
  activeNavItem?: string | undefined;
};

const SecondaryNav = ({
  secondaryNavList = [],
  activeNavItem = ''
}: SecondaryNavProps) => {
  return (
    <nav aria-label="Primary navigation" className="secondary-nav">
      <div className="usa-nav__inner">
        <ul className="usa-nav__primary usa-accordion">
          {secondaryNavList.map(item => (
            <li
              key={item.id}
              className={`usa-nav__primary-item ${
                activeNavItem === item.slug ? 'usa-current' : ''
              }`.trim()}
              data-testid="header-nav-item"
            >
              <Link className="secondary-nav__link" to={item.link}>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SecondaryNav;
