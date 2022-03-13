import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';
import {
  IconArrowBack,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import useCheckResponsiveScreen from 'hooks/checkMobile';

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
  const isMobile = useCheckResponsiveScreen('tablet');
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

  useEffect(() => {
    // Fixes edge case: subnavigation remains open when user (when in small screen size) expands window to desktop size really fast (using window manager)
    if (!isMobile) {
      setIsSubNavOpen(false);
    }
  }, [isMobile]);

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
                key={`mobile-subnav--${page}`}
                className={classnames({
                  'subNav__item--group-border': groupEnd
                })}
              >
                <NavLink
                  to={`/governance-review-team/${systemId}/${page}`}
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
