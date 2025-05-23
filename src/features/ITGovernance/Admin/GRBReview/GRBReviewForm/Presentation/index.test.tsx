import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBReviewType } from 'gql/generated/graphql';
import { grbReview } from 'tests/mock/grbReview';

import { MessageProvider } from 'hooks/useMessage';

import Presentation from '.';

describe('GRB review form - presentation', () => {
  it('renders the step and takes a snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${grbReview.id}/grb-review/presentation`
        ]}
      >
        <MockedProvider>
          <MessageProvider>
            <Route path="/it-governance/:systemId/grb-review/:step">
              <Presentation grbReview={grbReview} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check that the heading is rendered
    expect(
      screen.getByRole('heading', {
        name: 'Step 2 of 4 Presentation'
      })
    ).toBeInTheDocument();

    // Check that the standard description is rendered
    expect(
      screen.getByText(
        'Organize a GRB meeting for the project team’s presentation to the GRB.'
      )
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the async form', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${grbReview.id}/grb-review/presentation`
        ]}
      >
        <MockedProvider>
          <MessageProvider>
            <Route path="/it-governance/:systemId/grb-review/:step">
              <Presentation
                grbReview={{
                  ...grbReview,
                  grbReviewType: SystemIntakeGRBReviewType.ASYNC
                }}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check that the standard description is rendered
    expect(
      screen.getByText(
        'Organize a meeting to record the project team’s presentation for the GRB.'
      )
    ).toBeInTheDocument();
  });
});
