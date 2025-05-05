import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { getSystemIntakeGRBDiscussionsQuery } from 'tests/mock/discussions';
import { getSystemIntakeGRBReviewQuery } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Discussions from '.';

describe('Discussions', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
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
    );

    expect(await screen.findByText('Discussions')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
