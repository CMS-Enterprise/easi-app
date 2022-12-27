import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';

import CedarContactSelect from './index';

describe('CedarContactSelect', () => {
  // Cedar contacts query mock
  const cedarContactsQuery = {
    request: {
      query: GetCedarContactsQuery,
      variables: {
        commonName: 'Adeline'
      }
    },
    result: {
      data: {
        cedarPersonsByCommonName: [
          {
            commonName: 'Adeline Aarons',
            email: 'adeline.aarons@local.fake',
            euaUserId: 'ABCD'
          }
        ]
      }
    }
  };

  it('selects contact from dropdown', async () => {
    const { asFragment, getByTestId, findByText } = render(
      <MockedProvider mocks={[cedarContactsQuery]} addTypename={false}>
        <CedarContactSelect
          id="cedarContactSelect"
          name="cedarContactSelect"
          onChange={() => null}
        />
      </MockedProvider>
    );

    // Type first name into select field input
    const input = getByTestId('cedar-contact-select');
    userEvent.type(input, 'Adeline');

    // Get mocked CEDAR result
    const userOption = await findByText('Adeline Aarons, ABCD');

    // Check that component matches snapshot with expanded dropdown
    expect(asFragment()).toMatchSnapshot();

    // Select option
    userEvent.click(userOption);

    // Check that select field displays correct value
    expect(input).toHaveValue('Adeline Aarons, ABCD');
  });
});
