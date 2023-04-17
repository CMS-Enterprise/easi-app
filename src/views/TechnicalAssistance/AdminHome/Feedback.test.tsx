import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import { trbRequestSummary } from 'data/mock/trbRequest';
import GetTrbRequestFeedbackQuery from 'queries/GetTrbRequestFeedbackQuery';

import Feedback from './Feedback';

describe('Trb Admin: Feedback', () => {
  const id = '449ea115-8bfa-48c3-b1dd-5a613d79fbae';
  const feedbackMessage = 'Can you hear me now?';

  it('renders feedback', async () => {
    const { findByText } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbRequestFeedbackQuery,
              variables: {
                id
              }
            },
            result: {
              data: {
                trbRequest: {
                  id,
                  feedback: [
                    {
                      id: '1429ea1b-d046-47a8-965f-73e5678675a4',
                      action: 'REQUEST_EDITS',
                      feedbackMessage,
                      author: {
                        commonName: 'Adeline Aarons',
                        __typename: 'UserInfo'
                      },
                      createdAt: '2023-03-27T16:31:35.958568Z',
                      __typename: 'TRBRequestFeedback'
                    }
                  ],
                  __typename: 'TRBRequest'
                }
              }
            }
          }
        ]}
      >
        <MemoryRouter>
          <Feedback trbRequestId={id} trbRequest={trbRequestSummary} />
        </MemoryRouter>
      </MockedProvider>
    );

    await findByText(feedbackMessage);
  });

  it('shows no feedback alert', async () => {
    const { findByText } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbRequestFeedbackQuery,
              variables: {
                id
              }
            },
            result: {
              data: {
                trbRequest: {
                  id,
                  feedback: [],
                  __typename: 'TRBRequest'
                }
              }
            }
          }
        ]}
      >
        <MemoryRouter>
          <Feedback trbRequestId={id} trbRequest={trbRequestSummary} />
        </MemoryRouter>
      </MockedProvider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:requestFeedback.noFeedbackAlert')
    );
  });
});
