import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { PrimaryNav } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { AppState } from 'reducers/rootReducer';
import { Flags } from 'types/flags';
import user from 'utils/user';

import '../Header/index.scss';
import './index.scss';

export type NavigationProps = {
  mobile?: boolean;
  signout: () => void;
  toggle: (active: boolean) => void;
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

const NavigationBar = ({
  mobile,
  signout,
  toggle,
  userName
}: NavigationProps) => {
  const { t } = useTranslation();
  const flags = useFlags();
  const { groups, isUserSet } = useSelector((state: AppState) => state.auth);

  const primaryLinks = navLinks(flags, groups, isUserSet)
    .map(
      route =>
        route.isEnabled && (
          <div className="easi-nav" key={route.label}>
            <NavLink
              to={route.link}
              activeClassName="usa-current"
              className="easi-nav__link"
              onClick={() => toggle(false)}
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
        )
    )
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

  const navItems = mobile ? primaryLinks.concat(userLinks) : primaryLinks;

  return (
    <nav
      aria-label={t('header:navigation')}
      data-testid="navigation-bar"
      className="easi-header grid-container display-flex width-full"
    >
      <PrimaryNav
        onClick={() => toggle(false)}
        mobileExpanded={mobile}
        aria-label="Primary navigation"
        items={navItems}
      />
    </nav>
  );
};

export default NavigationBar;
