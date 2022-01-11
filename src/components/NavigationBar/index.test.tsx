import React from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import NavigationBar, { navLinks } from './index';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: String) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    };
  }
}));

jest.mock('launchdarkly-react-client-sdk', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useFlags: () => {
    return {
      systemProfile: true,
      help: true
    };
  }
}));

describe('The NavigationBar component', () => {
  it('renders without errors', done => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <NavigationBar
          mobile
          toggle={() => !null}
          signout={() => null}
          userName="A11Y"
        />
      </MemoryRouter>
    );

    expect(getByTestId('navigation-bar')).toBeInTheDocument();
    done();
  });

  it('displays every navigation element', done => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/system/making-a-request']}>
        <NavigationBar
          mobile
          toggle={() => !null}
          signout={() => null}
          userName="A11Y"
        />
      </MemoryRouter>
    );

    const { t } = useTranslation();
    const flags = useFlags();

    navLinks(flags).forEach(route => {
      if (route.isEnabled) {
        const linkTitle = t(`header:${route.label}`);
        expect(getByText(linkTitle)).toBeInTheDocument();
      }
    });
    done();
  });
});
