import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { grbReview } from 'tests/mock/grbReview';

import { MessageProvider } from 'hooks/useMessage';

import AdditionalDocumentation from '.';

describe('GRB review form - additional documents', () => {
  it('renders the step', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/it-governance/${grbReview.id}/grb-review/documents`]}
      >
        <MessageProvider>
          <Route path="/it-governance/:systemId/grb-review/:step">
            <AdditionalDocumentation grbReview={grbReview} />
          </Route>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Step 3 of 4 Additional documentation'
      })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
