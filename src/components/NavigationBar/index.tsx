import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { PrimaryNav } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { Flags } from 'types/flags';

import './index.scss';

export type NavigationProps = {
  mobile?: boolean;
  signout: () => void;
  toggle: (active: boolean) => void;
  userName?: string;
};

export const navLinks = (flags: Flags) => [
  {
    link: '/',
    label: 'home',
    isEnabled: true
  },
  {
    link: '/system-profile',
    label: 'systems',
    isEnabled: flags.systemProfile
  },
  {
    link: '/system/making-a-request',
    label: 'addSystem',
    isEnabled: true
  },
  {
    link: '/508/making-a-request',
    label: 'add508Request',
    isEnabled: true
  },
  {
    link: '/sandbox',
    label: 'sandbox',
    isEnabled: flags.sandbox
  },
  {
    link: '/help',
    label: 'help',
    isEnabled: flags.help
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

  const primaryLinks = navLinks(flags).map(
    route =>
      route.isEnabled && (
        <div className="easi-nav" key={route.label}>
          <NavLink
            to={route.link}
            activeClassName="usa-current"
            className="easi-nav__link"
            exact
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
  );

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
      className="border-top-light"
    >
      <div className="grid-container">
        <PrimaryNav
          onToggleMobileNav={() => toggle(false)}
          mobileExpanded={mobile}
          aria-label="Primary navigation"
          items={navItems}
        />
      </div>
    </nav>
  );
};

export default NavigationBar;
