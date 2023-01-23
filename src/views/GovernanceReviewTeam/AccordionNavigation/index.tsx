import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  IconArrowBack,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import useCheckResponsiveScreen from 'hooks/checkMobile';

import './index.scss';

type AccordionNavigationItemProps = {
  groupEnd?: boolean;
  route: string;
  text: string;
};

type AccordionNavigationProps = {
  activePage: string;
  subNavItems: AccordionNavigationItemProps[];
  defaultTitle?: string;
};

const AccordionNavigation = ({
  activePage,
  subNavItems,
  defaultTitle = 'Intake Request'
}: AccordionNavigationProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const isMobile = useCheckResponsiveScreen('tablet');
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  /** Page title text property from current page */
  const activePageTitle: string | undefined = useMemo(() => {
    const currentPage = subNavItems.find(
      item => item.route.split('/')[3] === activePage
    );

    return currentPage?.text;
  }, [activePage, subNavItems]);

  useEffect(() => {
    // Fixes edge case: subnavigation remains open when user (when in small screen size) expands window to large size really fast (using window manager)
    if (!isMobile) {
      setIsAccordionOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="easi-grt__subNav-accordion">
      <button
        type="button"
        className="usa-menu-btn easi-header__basic width-full"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        aria-expanded={isAccordionOpen}
        aria-controls="easi-grt__subNav"
      >
        <h3 className="padding-left-1">{t(activePageTitle || defaultTitle)}</h3>
        {!isAccordionOpen ? (
          <IconExpandMore size={3} />
        ) : (
          <IconExpandLess size={3} />
        )}
      </button>
      {isAccordionOpen && (
        <div
          id="easi-grt__subNav"
          className="easi-grt__subNav__list-container bg-primary-dark"
        >
          <ul className="easi-grt__subNav__list subNav">
            {subNavItems.map(({ groupEnd, route, text }) => (
              <li
                key={`mobile-subnav--${text}`}
                className={classnames({
                  'subNav__item--group-border': groupEnd
                })}
              >
                <NavLink
                  to={route}
                  className={classnames({
                    'subNav--current': route.split('/')[3] === activePage
                  })}
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
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
        </div>
      )}
    </div>
  );
};

export default AccordionNavigation;
