import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import AdditionalContacts from './index';

describe('CedarContactSelect', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MockedProvider>
        <AdditionalContacts
          systemIntakeId="abc"
          activeContact={{
            systemIntakeId: 'abc',
            commonName: 'Jane Doe',
            component: 'CMS',
            role: 'Product Owner',
            email: 'janedoe@test.com',
            euaUserId: 'ABCD'
          }}
          setActiveContact={() => null}
          contacts={[]}
          createContact={() => null}
          updateContact={() => null}
          deleteContact={() => null}
        />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
