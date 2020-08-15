import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Confirmation from './index';

describe('The Business Case Confirmation page', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Confirmation />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
