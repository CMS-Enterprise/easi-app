import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import {
  IconArrowBack,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import IconButton from 'components/shared/IconButton';
import IconLink from 'components/shared/IconLink';
import { NavLinkProps } from 'components/shared/SideNavigation/types';
import useCheckResponsiveScreen from 'hooks/checkMobile';

import './index.scss';

type AccordionNavigationProps = {
  items: NavLinkProps[];
  defaultTitle?: string;
};

/** Accordion navigation for mobile side nav view */
const AccordionNavigation = ({
  items,
  defaultTitle = 'Intake Request'
}: AccordionNavigationProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const isMobile = useCheckResponsiveScreen('tablet');

  const { pathname, hash } = useLocation();
  const pathnameWithHash = `${pathname}${hash}`;

  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  /** Page title text property from current page */
  const activePageTitle: string | undefined = useMemo(() => {
    const currentPage = items.find(item => item.route === pathname);

    return currentPage?.text;
  }, [items, pathname]);

  const MenuButtonIcon = useMemo(
    () => (isAccordionOpen ? IconExpandLess : IconExpandMore),
    [isAccordionOpen]
  );

  useEffect(() => {
    // Fixes edge case: subnavigation remains open when user (when in small screen size) expands window to large size really fast (using window manager)
    if (!isMobile) {
      setIsAccordionOpen(false);
    }
  }, [isMobile]);

  // Hide navigation on desktop
  if (!isMobile) return null;

  return (
    <div className="easi-accordion-nav">
      <IconButton
        type="button"
        className="usa-menu-btn easi-header__basic width-full"
        iconPosition="after"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        aria-expanded={isAccordionOpen}
        aria-controls="easiAccordionNav"
        icon={<MenuButtonIcon size={3} />}
      >
        <h3 className="padding-left-1">{t(activePageTitle || defaultTitle)}</h3>
      </IconButton>

      {isAccordionOpen && (
        <nav className="bg-primary-dark" id="easiAccordionNav">
          <ul className="usa-sidenav border-bottom-0">
            {items.map(item => {
              return (
                <li
                  key={item.text}
                  className={classNames('usa-sidenav__item border-top-0', {
                    'border-bottom-1px border-primary': item?.groupEnd
                  })}
                >
                  <UswdsReactLink
                    to={item.route}
                    onClick={() => setIsAccordionOpen(false)}
                    className={classNames({
                      'usa-current': item.route === pathname
                    })}
                  >
                    {t(item.text)}
                  </UswdsReactLink>

                  {
                    // Child navigation links
                    item?.children && (
                      <ul className="usa-sidenav__sublist">
                        {item.children.map(child => (
                          <li
                            key={child.text}
                            className="usa-sidenav__item border-top-0"
                          >
                            <NavHashLink
                              to={child.route}
                              onClick={() => setIsAccordionOpen(false)}
                              className={classNames('usa-link', {
                                'usa-current': pathnameWithHash === child.route
                              })}
                            >
                              {t(child.text)}
                            </NavHashLink>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                </li>
              );
            })}

            <li className="margin-top-2">
              <IconLink
                to="/"
                icon={<IconArrowBack />}
                className="text-underline"
              >
                {t('back.allRequests')}
              </IconLink>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AccordionNavigation;
