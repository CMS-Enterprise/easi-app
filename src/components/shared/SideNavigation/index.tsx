import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { IconArrowBack } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

import IconLink from '../IconLink';

import { NavLinkProps } from './types';

import './index.scss';

type SideNavigationProps = {
  items: Array<NavLinkProps>;
  /** Link with back arrow */
  returnLink?: {
    to: string;
    text: string;
  };
  className?: string;
};

/**
 * Side navigation component
 */
const SideNavigation = ({
  items,
  returnLink,
  className
}: SideNavigationProps) => {
  const { t } = useTranslation();
  const { pathname, hash } = useLocation();

  const pathnameWithHash = `${pathname}${hash}`;

  return (
    <nav className={classNames('easi-sidenav', className)}>
      <ul className="usa-sidenav border-bottom-0">
        {
          // Return arrow link
          returnLink && (
            <li className="margin-bottom-4">
              <IconLink
                to={returnLink.to}
                icon={<IconArrowBack />}
                className="text-primary hover:text-primary-dark text-underline"
              >
                {t(returnLink.text)}
              </IconLink>
            </li>
          )
        }

        {items.map(item => {
          return (
            <li
              key={item.text}
              className={classNames('usa-sidenav__item border-top-0', {
                'border-bottom-1px border-disabled-light': item?.groupEnd
              })}
            >
              <UswdsReactLink
                to={item.route}
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
                        className="usa-sidenav__item border-top-0"
                        key={child.text}
                      >
                        <NavHashLink
                          to={child.route}
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
      </ul>
    </nav>
  );
};

export default SideNavigation;
