import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MentionTextArea from '.';

const content =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

describe('MentionTextArea component', () => {
  it('truncates text with read more/less button', async () => {
    render(
      <MentionTextArea
        id="mentionTextArea"
        initialContent={content}
        truncateText
      />
    );

    const truncatedText = content.slice(0, 275);

    expect(screen.getByText(`${truncatedText} ...`)).toBeInTheDocument();

    const readMoreButton = screen.getByRole('button', { name: 'Read more' });
    expect(readMoreButton).toBeInTheDocument();
    userEvent.click(readMoreButton);

    const readLessButton = await screen.findByRole('button', {
      name: 'Read less'
    });
    expect(readLessButton).toBeInTheDocument();

    expect(screen.getByText(content)).toBeInTheDocument();
  });
});
