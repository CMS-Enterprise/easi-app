import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { SystemProfileSectionLockStatus } from 'gql/generated/graphql';

import easiMockStore from 'utils/testing/easiMockStore';

import SectionLock from './index';

// TODO: Remove temp type assertion and use data type from lock context after completed
const sectionLock = {
  lockedByUserAccount: {
    username: 'USR2',
    commonName: 'User Two',
    email: 'user.two@local.fake'
  }
} as SystemProfileSectionLockStatus;

describe('SectionLock', () => {
  it('renders if section is locked by other user', () => {
    const store = easiMockStore();
    render(
      <Provider store={store}>
        <SectionLock sectionLock={sectionLock} />
      </Provider>
    );

    expect(screen.getByTestId('avatar--basic')).toHaveTextContent('UT');
    expect(screen.getByText(/is currently editing/)).toBeInTheDocument();
  });

  it('renders if section is locked by current user', () => {
    const store = easiMockStore({ euaUserId: 'USR2' });

    render(
      <Provider store={store}>
        <SectionLock sectionLock={sectionLock} />
      </Provider>
    );

    expect(screen.getByTestId('avatar--basic')).toHaveTextContent('UT');
    expect(
      screen.getByText('You are editing this section.')
    ).toBeInTheDocument();
  });

  it('does not render if section is not locked', () => {
    const store = easiMockStore();
    render(
      <Provider store={store}>
        <SectionLock />
      </Provider>
    );

    expect(screen.queryByTestId('avatar--basic')).not.toBeInTheDocument();
  });
});
