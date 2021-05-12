import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { businessCaseInitialData } from 'data/businessCase';

import Confirmation from './index';

describe('The Business Case Confirmation page', () => {
  const testBusinessCase = {
    ...businessCaseInitialData,
    systemIntakeId: '12345'
  };
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter>
        <Confirmation businessCase={testBusinessCase} />
      </MemoryRouter>
    );
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Confirmation businessCase={testBusinessCase} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
