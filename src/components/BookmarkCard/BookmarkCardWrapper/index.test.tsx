import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import BookmarkCard from '../index';

import BookmarkCardWrapper from './index';

describe('BookmarkCardWrapper', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BookmarkCardWrapper>
          <BookmarkCard type="systemList" {...mockSystemInfo[0]} />
        </BookmarkCardWrapper>
      </MemoryRouter>
    );

    expect(getByTestId('single-bookmark-card')).toBeInTheDocument();
    expect(getByTestId('bookmard-card-wrapper')).toBeInTheDocument();
  });
});
