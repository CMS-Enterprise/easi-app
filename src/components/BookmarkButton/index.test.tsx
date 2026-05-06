import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateCedarSystemBookmarkDocument } from 'gql/generated/graphql';

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

  it('toggles to bookmarked without refetching a separate bookmark query', async () => {
    const user = userEvent.setup();

    const { getByRole, getByTestId } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[
            {
              request: {
                query: CreateCedarSystemBookmarkDocument,
                variables: {
                  input: {
                    cedarSystemId: '123'
                  }
                }
              },
              result: {
                data: {
                  createCedarSystemBookmark: {
                    __typename: 'CreateCedarSystemBookmarkPayload',
                    cedarSystemBookmark: {
                      __typename: 'CedarSystemBookmark',
                      cedarSystemId: '123'
                    }
                  }
                }
              }
            }
          ]}
        >
          <BookmarkButton id="123" isBookmarked={false} />
        </MockedProvider>
      </MemoryRouter>
    );

    await user.click(getByRole('button'));

    await waitFor(() => {
      expect(getByTestId('is-bookmarked')).toBeInTheDocument();
    });
  });
});
