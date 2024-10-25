import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { businessCaseInitialData } from 'data/businessCase';

import Confirmation from './index';

describe('The Business Case Confirmation page', () => {
  const testBusinessCase = {
    ...businessCaseInitialData,
    systemIntakeId: '12345'
  };

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Confirmation businessCase={testBusinessCase} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
