import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

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

  it('does not render continue button w/oq continue param', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/508/testing-overview']}>
        <Route
          path="/508/testing-overview"
          component={AccessibilityTestingStepsOverview}
        />
      </MemoryRouter>
    );

    expect(component.find('[data-testid="continue-link"]').exists()).toEqual(
      false
    );
  });

  it('renders continue button w/ continue param', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/508/testing-overview?continue=true']}>
        <Route
          path="/508/testing-overview"
          component={AccessibilityTestingStepsOverview}
        />
      </MemoryRouter>
    );

    expect(component.find('[data-testid="continue-link"]').exists()).toEqual(
      true
    );
  });
});
