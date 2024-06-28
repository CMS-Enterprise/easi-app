import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { ModalRef } from '@trussworks/react-uswds';
import i18next from 'i18next';

import { trbRequestSummary } from 'data/mock/trbRequest';
import GetTrbRequestFeedbackQuery from 'queries/GetTrbRequestFeedbackQuery';
import { TrbRequestIdRef } from 'types/technicalAssistance';

import Feedback from './Feedback';

describe('Trb Admin: Feedback', () => {
  const { id } = trbRequestSummary;
  const feedbackMessage = 'Can you hear me now?';
  const modalRef = React.createRef<ModalRef>();
  const trbRequestIdRef = React.createRef<TrbRequestIdRef>();

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
          <Feedback
            trbRequestId={id}
            trbRequest={trbRequestSummary}
            assignLeadModalRef={modalRef}
            assignLeadModalTrbRequestIdRef={trbRequestIdRef}
          />
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
          <Feedback
            trbRequestId={id}
            trbRequest={trbRequestSummary}
            assignLeadModalRef={modalRef}
            assignLeadModalTrbRequestIdRef={trbRequestIdRef}
          />
        </MemoryRouter>
      </MockedProvider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:requestFeedback.noFeedbackAlert')
    );
  });
});
