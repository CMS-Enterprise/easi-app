import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import TechnicalAssistance from '.';

describe('Technical Assistance (TRB) homepage', () => {
  it('renders a list of trb requests', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/trb']}>
        <Route path="/trb">
          <MockedProvider
            mocks={
              [
                /*
              {
                request: {
                  query: null
                },
                result: {
                  data: {
                  }
                }
              }
              */
              ]
            }
            addTypename={false}
          >
            <TechnicalAssistance />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
