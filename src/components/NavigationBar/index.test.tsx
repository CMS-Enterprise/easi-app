import React from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import configureMockStore from 'redux-mock-store';

import NavigationBar, { navLinks } from './index';

vi.mock('react-i18next', () => ({
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

vi.mock('launchdarkly-react-client-sdk', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useFlags: () => {
    return {
      systemProfile: true,
      help: true
    };
  }
}));

describe('The NavigationBar component', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'A11Y',
      name: 'Jerry Seinfeld',
      isUserSet: true,
      groups: []
    }
  });

  it('renders without errors', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <NavigationBar signout={() => null} userName="A11Y" />
        </MemoryRouter>
      </Provider>
    );

    expect(getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('displays every navigation element', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/system/making-a-request']}>
          <NavigationBar signout={() => null} userName="A11Y" />
        </MemoryRouter>
      </Provider>
    );

    const { t } = useTranslation();
    const flags = useFlags();

    navLinks(flags, [], true).forEach(route => {
      if (route.isEnabled) {
        const linkTitle = t(`header:${route.label}`);
        expect(getByText(linkTitle)).toBeInTheDocument();
      }
    });
  });
});
