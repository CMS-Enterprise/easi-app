import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import AccessibilityTestingStepsOverview from './index';

describe('The accessibility testing overview', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter>
        <AccessibilityTestingStepsOverview />
      </MemoryRouter>
    );
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <AccessibilityTestingStepsOverview />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
