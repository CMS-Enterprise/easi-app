import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  SendPresentationDeckReminderDocument,
  SendPresentationDeckReminderMutation,
  SendPresentationDeckReminderMutationVariables
} from 'gql/generated/graphql';
import i18next from 'i18next';

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
    data: {
      __typename: 'Mutation'
    }
  }
};

describe('SendPresentationReminder', () => {
  it('renders without crashing', () => {
    render(
      <MockedProvider mocks={[sendReminderEmail]}>
        <SendPresentationReminder
          systemIntakeID="123"
          presentationDeckFileURL={null}
          presentationDeckFileName={null}
          id="file-input"
          name="file"
          onChange={vi.fn()}
        />
      </MockedProvider>
    );

    expect(
      screen.getByText(
        i18next.t<string>('grbReview:presentationLinks.sendReminderCard.header')
      )
    ).toBeInTheDocument();
  });

  it('handles file upload', () => {
    render(
      <MockedProvider mocks={[sendReminderEmail]}>
        <SendPresentationReminder
          systemIntakeID="123"
          presentationDeckFileURL={null}
          presentationDeckFileName={null}
          id="file-input"
          name="file"
          onChange={vi.fn()}
        />
      </MockedProvider>
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
      <MockedProvider mocks={[sendReminderEmail]}>
        <SendPresentationReminder
          systemIntakeID="test-id"
          presentationDeckFileURL={null}
          presentationDeckFileName={null}
          id="file-input"
          name="file"
          onChange={vi.fn()}
        />
      </MockedProvider>
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
