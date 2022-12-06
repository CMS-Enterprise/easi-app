import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import AdditionalContacts from './index';

describe('CedarContactSelect', () => {
  it('matches the snapshot', async () => {
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
        />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
