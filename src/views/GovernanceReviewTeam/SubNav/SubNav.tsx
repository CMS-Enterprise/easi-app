import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';
import {
  IconArrowBack,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type SubNavItemProps = {
  groupEnd?: boolean;
  page: string;
  text: string;
};

type SubNavProps = {
  systemId: string;
  subNavItems: SubNavItemProps[];
};

const SubNav = ({ systemId, subNavItems }: SubNavProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const [isSubNavOpen, setIsSubNavOpen] = useState<boolean>(false);
  const [activePageTitle, setActivePageTitle] = useState<string>(
    'general:intake'
  );
  const { activePage } = useParams<{
    activePage: string;
  }>();

  const navLinkClickHandler = (text: string) => {
    setIsSubNavOpen(!isSubNavOpen);
    setActivePageTitle(text);
  };

  return (
    <div className="easi-grt__subNav-accordion">
      <button
        type="button"
        className="usa-menu-btn easi-header__basic width-full"
        onClick={() => setIsSubNavOpen(!isSubNavOpen)}
      >
        <h3 className="padding-left-1">{t(activePageTitle)}</h3>
        {!isSubNavOpen ? (
          <IconExpandMore size={3} />
        ) : (
          <IconExpandLess size={3} />
        )}
      </button>
      {isSubNavOpen && (
        <nav className="easi-grt__subNav__list-container">
          <ul className="easi-grt__subNav__list subNav">
            {subNavItems.map(({ groupEnd, page, text }) => (
              <li
                className={classnames({
                  'subNav__item--group-border': groupEnd
                })}
              >
                <NavLink
                  to={`/governance-review-team/${systemId}/${page}`}
                  key={page}
                  className={classnames({
                    'subNav--current': page === activePage
                  })}
                  onClick={() => navLinkClickHandler(text)}
                >
                  {t(text)}
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
