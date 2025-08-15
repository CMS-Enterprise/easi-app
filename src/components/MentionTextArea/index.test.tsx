import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MentionTextArea from '.';

const content =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

describe('MentionTextArea component', () => {
  it('renders the component to view text', () => {
    const { asFragment } = render(
      <MentionTextArea
        id="mentionTextArea"
        initialContent={content}
        editable={false}
      />
    );

    expect(asFragment()).toMatchSnapshot();

    expect(screen.getByText(content)).toBeInTheDocument();

    // Hide "Read more" button when `truncateText` is false
    expect(screen.queryByRole('button', { name: 'Read more' })).toBeNull();
  });

  it('renders the editable text area component', async () => {
    const { asFragment } = render(
      <MentionTextArea id="mentionTextArea" editable />
    );

    const user = userEvent.setup();

    const editor = screen.getByRole('textbox');
    const text = 'This is the text!';

    await user.type(editor, text);

    expect(editor).toHaveTextContent(text);

    expect(asFragment()).toMatchSnapshot();
  });

  it('truncates text with read more/less button', async () => {
    render(
      <MentionTextArea
        id="mentionTextArea"
        initialContent={content}
        truncateText
      />
    );
    const user = userEvent.setup();

    const truncatedText = content.slice(0, 275);

    expect(screen.getByText(`${truncatedText} ...`)).toBeInTheDocument();

    const readMoreButton = screen.getByRole('button', { name: 'Read more' });
    expect(readMoreButton).toBeInTheDocument();
    await user.click(readMoreButton);

    const readLessButton = await screen.findByRole('button', {
      name: 'Read less'
    });
    expect(readLessButton).toBeInTheDocument();

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('handles truncated text shorter than character limit', () => {
    const shortenedString = content.slice(0, 100);

    render(
      <MentionTextArea
        id="mentionTextArea"
        initialContent={shortenedString}
        truncateText
      />
    );

    expect(screen.queryByRole('button', { name: 'Read more' })).toBeNull();
  });
});
