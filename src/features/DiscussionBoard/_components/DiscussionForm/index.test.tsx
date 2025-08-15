import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import '@testing-library/jest-dom';

import DiscussionForm from './index';

describe('DiscussionForm', () => {
  it('Opens the modal when button is clicked', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <DiscussionForm
            type="discussion"
            systemIntakeID="da62f940-7964-452c-869b-077cf05b33b4"
            discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
            setDiscussionAlert={vi.fn()}
            mentionSuggestions={[]}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();

    await user.type(screen.getByRole('textbox'), 'Test discussion content');

    const submitButton = screen.getByRole('button', {
      name: 'Save discussion'
    });

    await waitFor(() => expect(submitButton).toBeEnabled());

    await user.click(submitButton);

    expect(
      await screen.findByRole('heading', {
        name: 'Are you sure you want to start this discussion?'
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId('discussion-board-type')).toHaveTextContent(
      'Primary discussion board'
    );
  });
});
