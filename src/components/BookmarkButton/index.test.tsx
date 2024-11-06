import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import BookmarkButton from '.';

describe('BookmarkButton', () => {
  it('renders a bookmarked icon', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider>
          <BookmarkButton id="123" isBookmarked />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(getByTestId('is-bookmarked')).toBeInTheDocument();
  });

  it('renders an unbookmarked icon', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MockedProvider>
          <BookmarkButton id="123" isBookmarked={false} />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(getByTestId('is-not-bookmarked')).toBeInTheDocument();
  });
});
