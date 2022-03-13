import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  IconArrowBack,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type SubNavProps = {
  systemId: string;
};

const SubNav = ({ systemId }: SubNavProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const [isSubNavOpen, setIsSubNavOpen] = useState<boolean>(false);

  const subNavItems = [
    {
      to: `/governance-review-team/${systemId}/intake-request`,
      text: 'general:intake'
    },
    {
      to: `/governance-review-team/${systemId}/business-case`,
      text: 'general:businessCase'
    },
    {
      to: `/governance-review-team/${systemId}/decision`,
      text: 'decision.title'
    },
    {
      to: `/governance-review-team/${systemId}/lcid`,
      text: 'lifecycleID.title',
      groupEnd: true
    },
    {
      to: `/governance-review-team/${systemId}/actions`,
      text: 'actions'
    },
    {
      to: `/governance-review-team/${systemId}/notes`,
      text: 'notes.heading'
    },
    {
      to: `/governance-review-team/${systemId}/dates`,
      text: 'dates.heading'
    }
  ];

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
            {subNavItems.map(subNavItem => (
              <li
                className={classnames({
                  'subNav__item--group-border': subNavItem.groupEnd
                })}
              >
                <NavLink
                  to={subNavItem.to}
                  key={subNavItem.to}
                  className={classnames({
                    'subNav--current': false
                  })}
                >
                  {t(subNavItem.text)}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/"
                key="home"
                className="display-flex flex-align-center"
              >
                <IconArrowBack className="margin-right-1" aria-hidden />
                {t('back.allRequests')}
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SubNav;
