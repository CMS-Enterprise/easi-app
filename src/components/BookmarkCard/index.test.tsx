import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import BookmarkCard from './index';

describe('BookmarkCard', () => {
  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <BookmarkCard {...mockSystemInfo[0]} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders corresponding health icon for status', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BookmarkCard {...mockSystemInfo[2]} />
      </MemoryRouter>
    );

    expect(getByTestId('system-health-icon')).toHaveClass(
      'system-health-icon-fail'
    );
  });
});
