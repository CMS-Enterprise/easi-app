import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GetCedarContactsDocument } from 'gql/generated/graphql';

import CedarContactSelect from './index';

const contact = {
  commonName: 'Adeline Aarons',
  email: 'adeline.aarons@local.fake',
  euaUserId: 'ABCD'
};

const contactLabel = `${contact.commonName}, ${contact.euaUserId} (${contact.email})`;

describe('CedarContactSelect', () => {
  // Cedar contacts query mock
  const cedarContactsQuery = {
    request: {
      query: GetCedarContactsDocument,
      variables: {
        commonName: contact.commonName
      }
    },
    result: {
      data: {
        cedarPersonsByCommonName: [contact]
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

    const user = userEvent.setup();

    // Type first name into select field input
    const input = getByTestId('cedar-contact-select');
    await user.type(input, contact.commonName);

    // Get mocked CEDAR result
    const userOption = await findByText(contactLabel);
    expect(userOption).toBeInTheDocument();

    // Check that component matches snapshot with expanded dropdown
    expect(asFragment()).toMatchSnapshot();

    // Select option
    await user.click(userOption);

    // Check that select field displays correct value
    expect(input).toHaveValue(contactLabel);
  });
});
