import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render } from 'enzyme';

import TestingTemplates from './index';

describe('TestingTemplates', () => {
  it('renders without crashing', () => {
    const component = render(
      <MemoryRouter>
        <TestingTemplates />
      </MemoryRouter>
    );
    expect(component.length).toBe(1);
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TestingTemplates />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
