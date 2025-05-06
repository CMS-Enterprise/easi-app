import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { getSystemIntakeGRBDiscussionsQuery } from 'tests/mock/discussions';
import { getSystemIntakeGRBReviewQuery } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';

import { BASIC_USER_PROD, GOVTEAM_PROD } from 'constants/jobCodes';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import DiscussionBoard from '.';

describe('Discussion board', () => {
  it('renders the primary discussion board', async () => {
    const store = easiMockStore({ groups: [BASIC_USER_PROD] });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['?discussionMode=view']}>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBDiscussionsQuery(),
              getSystemIntakeGRBReviewQuery({
                grbReviewStartedAt: '2025-04-06T15:02:20.066496346Z'
              })
            ]}
          >
            <Route>
              <div id="root">
                <DiscussionBoard systemIntakeID={systemIntake.id} />
              </div>
            </Route>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(
      await screen.findByRole('heading', {
        level: 4,
        name: 'Primary discussion board'
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'This page cannot be found.' })
    ).not.toBeInTheDocument();
  });

  it('renders the internal discussion board', async () => {
    const store = easiMockStore({ groups: [GOVTEAM_PROD] });

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['?discussionMode=view&discussionBoardType=INTERNAL']}
        >
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBDiscussionsQuery(),
              getSystemIntakeGRBReviewQuery({
                grbReviewStartedAt: '2025-04-06T15:02:20.066496346Z'
              })
            ]}
          >
            <Route>
              <div id="root">
                <DiscussionBoard systemIntakeID={systemIntake.id} />
              </div>
            </Route>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(
      await screen.findByRole('heading', {
        level: 4,
        name: 'Internal GRB discussion board'
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'This page cannot be found.' })
    ).not.toBeInTheDocument();
  });

  it('restricts the internal discussion board', async () => {
    const store = easiMockStore({ groups: [BASIC_USER_PROD] });

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['?discussionMode=view&discussionBoardType=INTERNAL']}
        >
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBDiscussionsQuery(),
              getSystemIntakeGRBReviewQuery({
                grbReviewStartedAt: '2025-04-06T15:02:20.066496346Z'
              })
            ]}
          >
            <Route>
              <div id="root">
                <DiscussionBoard systemIntakeID={systemIntake.id} />
              </div>
            </Route>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(
      await screen.findByRole('heading', {
        level: 4,
        name: 'Internal GRB discussion board'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'This page cannot be found.' })
    ).toBeInTheDocument();
  });
});
