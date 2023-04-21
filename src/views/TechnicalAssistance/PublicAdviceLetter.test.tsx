import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import GetTrbPublicAdviceLetterQuery from 'queries/GetTrbPublicAdviceLetterQuery';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';

import PublicAdviceLetter from './PublicAdviceLetter';

describe('Trb Public Advice Letter', () => {
  const id = '6e0d1524-204a-4014-b6d9-e995b1db3987';
  const data = {
    trbRequest: {
      id,
      name: 'Case 7 - Advice letter in review',
      requesterInfo: {
        commonName: 'Adeline Aarons',
        __typename: 'UserInfo'
      },
      requesterComponent: null,
      form: {
        id: '94a326d1-2ca7-4098-85df-556f944ba059',
        submittedAt: '2023-04-21T14:13:01.544189Z',
        component: 'Center for Medicare',
        needsAssistanceWith: 'Something is wrong with my system',
        __typename: 'TRBRequestForm'
      },
      type: 'NEED_HELP',
      consultMeetingTime: '2023-04-14T10:13:01.586156Z',
      adviceLetter: {
        id: 'a59f516a-107c-4baf-bdce-834ff1dc9a27',
        meetingSummary: 'Talked about stuff',
        nextSteps: null,
        isFollowupRecommended: false,
        dateSent: '2023-04-21T14:13:01.59368Z',
        followupPoint: null,
        recommendations: [
          {
            id: 'd29b1511-5e07-430a-97f5-c938fa67ebdf',
            title: 'Restart your computer',
            recommendation: 'I recommend you restart your computer',
            links: ['google.com', 'askjeeves.com'],
            __typename: 'TRBAdviceLetterRecommendation'
          }
        ],
        author: {
          euaUserId: 'ABCD',
          commonName: 'Adeline Aarons',
          __typename: 'UserInfo'
        },
        createdAt: '2023-04-21T14:13:01.589972Z',
        modifiedAt: '2023-04-21T14:13:01.595102Z',
        __typename: 'TRBAdviceLetter'
      },
      taskStatuses: {
        adviceLetterStatus: TRBAdviceLetterStatus.COMPLETED,
        __typename: 'TRBTaskStatuses'
      },
      __typename: 'TRBRequest'
    }
  };

  it('renders from email link', async () => {
    const { findByRole, asFragment } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbPublicAdviceLetterQuery,
              variables: {
                id
              }
            },
            result: {
              data
            }
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/advice-letter/${id}`]}>
          <Route exact path="/trb/advice-letter/:id">
            <PublicAdviceLetter />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    await findByRole('heading', {
      level: 1,
      name: i18next.t<string>('technicalAssistance:adviceLetterForm.heading')
    });

    await findByRole('heading', {
      level: 2,
      name: i18next.t<string>('technicalAssistance:adviceLetter.requestSummary')
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('errors on a bad request', async () => {
    const { findByRole } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbPublicAdviceLetterQuery,
              variables: {
                id
              }
            },
            error: new Error()
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/advice-letter/${id}`]}>
          <Route exact path="/trb/advice-letter/:id">
            <PublicAdviceLetter />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    await findByRole('heading', {
      level: 1,
      name: i18next.t<string>('error:notFound.heading')
    });
  });

  it('shows an incomplete alert for the letter', async () => {
    const { findByRole } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbPublicAdviceLetterQuery,
              variables: {
                id
              }
            },
            result: {
              data: {
                trbRequest: {
                  ...data.trbRequest,
                  taskStatuses: {
                    adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
                    __typename: 'TRBTaskStatuses'
                  }
                }
              }
            }
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/advice-letter/${id}`]}>
          <Route exact path="/trb/advice-letter/:id">
            <PublicAdviceLetter />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    await findByRole('heading', {
      level: 4,
      name: i18next.t<string>('technicalAssistance:adviceLetter.incomplete')
    });
  });

  it('renders from task list link', async () => {
    const { findByRole, findAllByRole, asFragment } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbPublicAdviceLetterQuery,
              variables: {
                id
              }
            },
            result: {
              data
            }
          }
        ]}
      >
        <MemoryRouter
          initialEntries={[
            {
              pathname: `/trb/advice-letter/${id}`,
              state: { fromTaskList: true }
            }
          ]}
        >
          <Route exact path="/trb/advice-letter/:id">
            <PublicAdviceLetter />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    await findByRole('heading', {
      level: 1,
      name: i18next.t<string>('technicalAssistance:adviceLetterForm.heading')
    });

    expect(
      await findAllByRole('link', {
        name: i18next.t<string>(
          'technicalAssistance:requestFeedback.returnToTaskList'
        )
      })
    ).toHaveLength(2);

    expect(asFragment()).toMatchSnapshot();
  });
});
