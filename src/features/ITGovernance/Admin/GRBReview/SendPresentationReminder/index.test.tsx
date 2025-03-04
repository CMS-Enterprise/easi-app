import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  SendPresentationDeckReminderDocument,
  SendPresentationDeckReminderMutation,
  SendPresentationDeckReminderMutationVariables
} from 'gql/generated/graphql';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';

import SendPresentationReminder from './index';

const sendReminderEmail: MockedQuery<
  SendPresentationDeckReminderMutation,
  SendPresentationDeckReminderMutationVariables
> = {
  request: {
    query: SendPresentationDeckReminderDocument,
    variables: {
      systemIntakeID: '123'
    }
  },
  result: {
    data: undefined
  }
};

describe('SendPresentationReminder', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[sendReminderEmail]}>
          <MessageProvider>
            <SendPresentationReminder
              systemIntakeID="123"
              presentationDeckFileURL={null}
              presentationDeckFileName={null}
              id="file-input"
              name="file"
              onChange={vi.fn()}
              clearFile={vi.fn()}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        i18next.t<string>('grbReview:presentationLinks.sendReminderCard.header')
      )
    ).toBeInTheDocument();
  });

  it('handles file upload', () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[sendReminderEmail]}>
          <MessageProvider>
            <SendPresentationReminder
              systemIntakeID="123"
              presentationDeckFileURL={null}
              presentationDeckFileName={null}
              id="file-input"
              name="file"
              onChange={vi.fn()}
              clearFile={vi.fn()}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    const fileInput = screen.getByTestId('file-upload-input');
    const file = new File(['dummy content'], 'example.pdf', {
      type: 'application/pdf'
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('example.pdf')).toBeInTheDocument();
  });

  it('handles send reminder click', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[sendReminderEmail]}>
          <MessageProvider>
            <SendPresentationReminder
              systemIntakeID="test-id"
              presentationDeckFileURL={null}
              presentationDeckFileName={null}
              id="file-input"
              name="file"
              onChange={vi.fn()}
              clearFile={vi.fn()}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    const sendReminderButton = screen.getByText(
      i18next.t<string>(
        'grbReview:presentationLinks.sendReminderCard.sendReminder'
      )
    );

    fireEvent.click(sendReminderButton);

    await waitFor(() => {
      expect(sendReminderButton).toBeDisabled();
    });
  });
});
