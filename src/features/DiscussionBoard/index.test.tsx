import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSystemIntakeGRBDiscussionsQuery } from 'tests/mock/discussions';
import { getSystemIntakeGRBReviewQuery } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';

import { BASIC_USER_PROD, GOVTEAM_PROD } from 'constants/jobCodes';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import DiscussionBoard from '.';

describe('Discussion board', () => {
  describe('Primary  discussion board', async () => {
    it('renders the discussion board', async () => {
      const store = easiMockStore({ groups: [BASIC_USER_PROD] });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['?discussionMode=view']}>
            <VerboseMockedProvider
              mocks={[
                getSystemIntakeGRBDiscussionsQuery(),
                getSystemIntakeGRBReviewQuery()
              ]}
            >
              <Route>
                <DiscussionBoard systemIntakeID={systemIntake.id} />
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

      expect(screen.getByTestId('visibility')).toHaveTextContent(
        'Not restricted'
      );

      expect(
        screen.queryByRole('heading', { name: 'This page cannot be found.' })
      ).not.toBeInTheDocument();
    });

    it('lists the requester as a tag option', async () => {
      const store = easiMockStore({ groups: [BASIC_USER_PROD] });
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['?discussionMode=start']}>
            <VerboseMockedProvider
              mocks={[
                getSystemIntakeGRBDiscussionsQuery(),
                getSystemIntakeGRBReviewQuery({
                  grbReviewStartedAt: '2025-04-06T15:02:20.066496346Z'
                })
              ]}
            >
              <Route>
                <DiscussionBoard systemIntakeID={systemIntake.id} />
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

      await user.type(screen.getByRole('textbox'), '@');

      const mentions = await screen.findByRole('tooltip');
      waitFor(() => expect(mentions).toHaveAttribute('data-state', 'visible'));

      expect(
        screen.getByRole('button', { name: 'Requester' })
      ).toBeInTheDocument();
    });
  });

  describe('Internal GRB discussion board', () => {
    it('renders the discussion board', async () => {
      const store = easiMockStore({ groups: [GOVTEAM_PROD] });

      render(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              '?discussionMode=view&discussionBoardType=INTERNAL'
            ]}
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
                <DiscussionBoard systemIntakeID={systemIntake.id} />
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

      expect(screen.getByTestId('visibility')).toHaveTextContent(
        'Visibility restricted'
      );

      expect(
        screen.queryByRole('heading', { name: 'This page cannot be found.' })
      ).not.toBeInTheDocument();
    });

    it('restricts the discussion board from basic users', async () => {
      const store = easiMockStore({ groups: [BASIC_USER_PROD] });

      render(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              '?discussionMode=view&discussionBoardType=INTERNAL'
            ]}
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
                <DiscussionBoard systemIntakeID={systemIntake.id} />
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

    it('does not list the requester as a tag option', async () => {
      const store = easiMockStore({ groups: [GOVTEAM_PROD] });
      const user = userEvent.setup();

      render(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              '?discussionMode=start&discussionBoardType=INTERNAL'
            ]}
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
                <DiscussionBoard systemIntakeID={systemIntake.id} />
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

      await user.type(screen.getByRole('textbox'), '@');

      const mentions = await screen.findByRole('tooltip');
      waitFor(() => expect(mentions).toHaveAttribute('data-state', 'visible'));

      expect(
        screen.queryByRole('button', { name: 'Requester' })
      ).not.toBeInTheDocument();
    });
  });
});
