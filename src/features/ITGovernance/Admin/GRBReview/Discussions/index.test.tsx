import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
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
              grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
            />
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText('Discussions')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
