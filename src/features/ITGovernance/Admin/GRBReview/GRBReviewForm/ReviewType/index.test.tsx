import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { grbReview } from 'tests/mock/grbReview';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ReviewType from '.';

describe('GRB review form - review type', () => {
  it('renders the step', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${grbReview.id}/grb-review/review-type`
        ]}
      >
        <VerboseMockedProvider>
          <MessageProvider>
            <Route path="/it-governance/:systemId/grb-review/:step">
              <ReviewType grbReview={grbReview} />
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Step 1 of 4 Review type'
      })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
