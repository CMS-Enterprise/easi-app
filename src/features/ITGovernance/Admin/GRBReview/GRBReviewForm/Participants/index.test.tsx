import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { grbReview } from 'tests/mock/grbReview';

import { MessageProvider } from 'hooks/useMessage';

import Participants from '.';

describe('GRB review form - participants and timeframe', () => {
  it('renders the step', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${grbReview.id}/grb-review/participants`
        ]}
      >
        <MessageProvider>
          <Route path="/it-governance/:systemId/grb-review/:step">
            <Participants grbReview={grbReview} />
          </Route>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Step 4 of 4 Participants and timeframe'
      })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
