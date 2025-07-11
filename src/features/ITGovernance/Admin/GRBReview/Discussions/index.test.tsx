import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntakeStatusAdmin } from 'gql/generated/graphql';
import { getSystemIntakeGRBDiscussionsQuery } from 'tests/mock/discussions';
import { getSystemIntakeGRBReviewQuery } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';

import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Discussions from '.';

const store = easiMockStore({ groups: ['EASI_P_GOVTEAM'] });

describe('Discussions', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <Provider store={store}>
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBDiscussionsQuery(),
              getSystemIntakeGRBReviewQuery()
            ]}
          >
            <Discussions
              systemIntakeID={systemIntake.id}
              statusAdmin={SystemIntakeStatusAdmin.GRB_MEETING_READY}
            />
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText('Discussions')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the read only view if the request is not in the GRB step', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBDiscussionsQuery(),
              getSystemIntakeGRBReviewQuery()
            ]}
          >
            <Discussions
              systemIntakeID={systemIntake.id}
              statusAdmin={
                SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_SUBMITTED
              }
            />
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole('button', { name: 'Start a discussion' })
    ).not.toBeInTheDocument();
  });
});
