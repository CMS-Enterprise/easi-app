import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import CedarContactSelect from './index';

describe('CedarContactSelect', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MockedProvider>
        <CedarContactSelect
          id="cedarContactSelect"
          name="cedarContactSelect"
          onChange={() => null}
        />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
