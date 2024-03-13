import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Header,
  IconMenu,
  Menu,
  NavDropDownButton,
  NavMenuButton,
  PrimaryNav
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import MainContent from 'components/MainContent';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import useOutsideClick from 'hooks/useOutsideClick';
import { AppState } from 'reducers/rootReducer';
import { Flags } from 'types/flags';
import user from 'utils/user';

import '../Header/index.scss';
import './index.scss';

export type NavigationProps = {
  signout: () => void;
  userName?: string;
};

export const navLinks = (
  flags: Flags,
  userGroups: string[],
  isUserSet: boolean
) => [
  {
    link: '/',
    label:
      isUserSet && user.isTrbAdmin(userGroups, flags) ? 'adminHome' : 'home',
    isEnabled: true
  },
  {
    link: '/systems',
    label: 'systems',
    isEnabled: flags.systemProfile
  },
  {
    link: '/system/making-a-request',
    label: 'addSystem',
    isEnabled: true
  },
  {
    link: '/508',
    label: 'add508Request',
    isEnabled: !flags.hide508Workflow
  },
  {
    link: '/trb',
    label: 'technicalAssistance',
    isEnabled: flags.technicalAssistance
  },
  {
    link: '/sandbox',
    label: 'sandbox',
    isEnabled: flags.sandbox
  },
  {
    link: '/help',
    label: 'help',
    isEnabled: true
  }
];

const systemLinks = (
  flags: Flags,
  userGroups: string[],
  isUserSet: boolean
) => [
  {
    link: '/systems?table-type=all-systems',
    label: 'allCMSSystems',
    isEnabled: true
  },
  {
    link: '/systems?table-type=my-systems',
    label: 'mySystems',
    isEnabled: true
  },
  {
    link: '/systems?table-type=bookmarked-systems',
    label: 'bookmarkedSystems',
    isEnabled: true
  },
  {
    link: '/system/request-type',
    label: 'addNewSystem',
    isEnabled: true
  }
];

// Handler for updating state for any NavDropDownButton
const onToggle = (
  index: number,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>
): void => {
  setIsOpen(prevIsOpen => {
    const newIsOpen = [false];
    newIsOpen[index] = !prevIsOpen[index];
    return newIsOpen;
  });
};

const NavigationBar = ({ signout, userName }: NavigationProps) => {
  const { t } = useTranslation();

  const flags = useFlags();

  const { groups, isUserSet } = useSelector((state: AppState) => state.auth);

  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useCheckResponsiveScreen('tablet');

  const location = useLocation();

  // Controls mobile side nav
  const [expanded, setExpanded] = useState(false);

  // Controls NavDropDownButton state for (currently one) any nav dropdown items
  const [isOpen, setIsOpen] = useState([false]);

  // onClick callback for toggling sidenav
  const onClick = (): void => setExpanded(prvExpanded => !prvExpanded);

  // Closes mobile nav if clicked outside
  useOutsideClick(mobileNavRef, onClick);

  const systemNavLinks = systemLinks(flags, groups, isUserSet).map(route => (
    <div className="easi-nav" key={route.label}>
      <NavLink
        to={route.link}
        className="usa-nav__link easi-nav__sublink"
        onClick={() => {
          setIsOpen([false]);
          setExpanded(false);
        }}
        exact={route.link === '/'}
      >
        <em
          className="usa-logo__text easi-nav__label"
          aria-label={t(`header:${route.label}`)}
        >
          {t(`header:${route.label}`)}
        </em>
      </NavLink>
    </div>
  ));

  const primaryLinks = navLinks(flags, groups, isUserSet)
    .map(route => {
      if (route.isEnabled) {
        if (route.label === 'systems') {
          return (
            <>
              <NavDropDownButton
                label={t(`header:${route.label}`)}
                menuId={route.label}
                isOpen={isOpen[0]}
                onToggle={() => onToggle(0, setIsOpen)}
                isCurrent={location.pathname === route.link}
              />
              {isOpen[0] && <Menu isOpen={isOpen[0]} items={systemNavLinks} />}
            </>
          );
        }
        return (
          <div className="easi-nav" key={route.label}>
            <NavLink
              to={route.link}
              activeClassName="usa-current"
              className="usa-nav__link easi-nav__link"
              onClick={() => {
                setIsOpen([false]);
                setExpanded(false);
              }}
              exact={route.link === '/'}
            >
              <em
                className="usa-logo__text easi-nav__label"
                aria-label={t(`header:${route.label}`)}
              >
                {t(`header:${route.label}`)}
              </em>
            </NavLink>
          </div>
        );
      }
      return null;
    })
    .filter(nav => nav);

  const userLinks = (
    <div className="easi-nav__signout-container">
      <div className="easi-nav__user margin-bottom-1">{userName}</div>
      <NavLink
        to="/"
        onClick={e => {
          e.preventDefault();
          signout();
        }}
        className="signout-link"
      >
        <em
          className="usa-logo__text text-underline"
          aria-label={t('header:signOut')}
        >
          {t('header:signOut')}
        </em>
      </NavLink>
    </div>
  );

  const navItems = isMobile ? primaryLinks.concat(userLinks) : primaryLinks;

  return (
    <MainContent>
      <Header
        basic
        extended
        className="easi-header"
        data-testid="navigation-bar"
        aria-label={t('header:navigation')}
      >
        <div
          className={classNames('usa-overlay', {
            'is-visible': expanded
          })}
        />
        <div className="nav-container" ref={expanded ? mobileNavRef : null}>
          <div className="usa-navbar">
            {isMobile && (
              <div className="usa-logo site-logo" id="logo">
                <Link to="/">
                  <em
                    className="usa-logo__text"
                    aria-label={t('header:returnHome')}
                  >
                    {t('general:appName')}
                  </em>
                </Link>
              </div>
            )}
            <NavMenuButton
              onClick={() => setExpanded(prvExpanded => !prvExpanded)}
              label={<IconMenu size={3} />}
            />
          </div>
          <PrimaryNav
            items={navItems}
            mobileExpanded={expanded}
            onToggleMobileNav={onClick}
          />
        </div>
      </Header>
    </MainContent>
  );
};

export default NavigationBar;
