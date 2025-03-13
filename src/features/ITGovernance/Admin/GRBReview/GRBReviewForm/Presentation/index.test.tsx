import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { grbReview } from 'tests/mock/grbReview';

import { MessageProvider } from 'hooks/useMessage';

import Presentation from '.';

describe('GRB review form - presentation', () => {
  it('renders the step', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${grbReview.id}/grb-review/presentation`
        ]}
      >
        <MessageProvider>
          <Route path="/it-governance/:systemId/grb-review/:step">
            <Presentation grbReview={grbReview} />
          </Route>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Step 2 of 4 Presentation'
      })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
