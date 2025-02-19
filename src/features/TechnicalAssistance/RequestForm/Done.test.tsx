import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import Done from './Done';

describe('Trb Request form: Request Done', () => {
  const requestId = 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7';

  it('renders success', () => {
    const { asFragment, getByText, getByRole } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/trb/requests/${requestId}/done`,
            state: { success: true }
          }
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <Done breadcrumbBar="" />
        </Route>
      </MemoryRouter>
    );
    getByText('Success!');
    expect(getByRole('link', { name: 'Return to task list' })).toHaveAttribute(
      'href',
      `/trb/task-list/${requestId}`
    );
    getByText('Reference number');
    getByText(requestId);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error', () => {
    const { asFragment, getByText, getByRole } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/trb/requests/${requestId}/done`,
            state: { success: false }
          }
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <Done breadcrumbBar="" />
        </Route>
      </MemoryRouter>
    );
    getByText('Something went wrong.');
    expect(getByRole('link', { name: 'Back to TRB Request' })).toHaveAttribute(
      'href',
      `/trb/requests/${requestId}`
    );
    expect(getByRole('link', { name: 'Return to task list' })).toHaveAttribute(
      'href',
      `/trb/task-list/${requestId}`
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
