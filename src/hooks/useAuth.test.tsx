import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import PageLoading from 'components/PageLoading';
import {
  getSystemIntakeGrbReviewersQuery,
  systemIntake
} from 'data/mock/systemIntake';
import { MockEuaUserId } from 'data/mock/users';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';
import NotFound from 'views/NotFound';

import useAuth from './useAuth';

const defaultStore = easiMockStore({
  euaUserId: systemIntake.euaUserId as MockEuaUserId,
  groups: ['EASI_P_USER']
});

const TestComponent = () => {
  const { user } = useAuth();

  if (!user) {
    return <PageLoading />;
  }

  if (user.isGrbReviewer(systemIntake.id)) {
    return <p>true</p>;
  }

  return <NotFound />;
};

describe('useAuth hook', () => {
  it('correctly returns true for isGrbReviewer', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeGrbReviewersQuery]}>
          <Provider store={defaultStore}>
            <TestComponent />
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('true')).toBeInTheDocument();
  });
});
