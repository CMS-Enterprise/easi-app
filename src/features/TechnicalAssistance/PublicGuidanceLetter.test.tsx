import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GetTRBPublicGuidanceLetterDocument,
  GetTRBPublicGuidanceLetterQuery,
  GetTRBPublicGuidanceLetterQueryVariables,
  TRBRequestType
} from 'gql/generated/graphql';
import i18next from 'i18next';

import {
  getTRBGuidanceLetterInsightsQuery,
  guidanceLetter,
  requester,
  trbRequest as mockTrbRequest
} from 'data/mock/trbRequest';
import { TRBGuidanceLetterStatus } from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';

import PublicGuidanceLetter from './PublicGuidanceLetter';

const { id } = mockTrbRequest;

const trbRequest: GetTRBPublicGuidanceLetterQuery['trbRequest'] = {
  __typename: 'TRBRequest',
  id,
  name: 'Case 7 - Guidance letter in review',
  requesterInfo: {
    commonName: requester.userInfo.commonName,
    __typename: 'UserInfo'
  },
  requesterComponent: requester.component,
  form: {
    id: '94a326d1-2ca7-4098-85df-556f944ba059',
    submittedAt: '2023-04-21T14:13:01.544189Z',
    component: 'Center for Medicare',
    needsAssistanceWith: 'Something is wrong with my system',
    __typename: 'TRBRequestForm'
  },
  type: TRBRequestType.NEED_HELP,
  consultMeetingTime: '2023-04-14T10:13:01.586156Z',
  guidanceLetter: {
    id: 'a59f516a-107c-4baf-bdce-834ff1dc9a27',
    meetingSummary: 'Talked about stuff',
    nextSteps: null,
    isFollowupRecommended: false,
    dateSent: '2023-04-21T14:13:01.59368Z',
    followupPoint: null,
    insights: guidanceLetter.insights,
    author: {
      euaUserId: requester.userInfo.euaUserId,
      commonName: requester.userInfo.commonName,
      __typename: 'UserInfo'
    },
    createdAt: '2023-04-21T14:13:01.589972Z',
    modifiedAt: '2023-04-21T14:13:01.595102Z',
    __typename: 'TRBGuidanceLetter'
  },
  taskStatuses: {
    guidanceLetterStatus: TRBGuidanceLetterStatus.COMPLETED,
    __typename: 'TRBTaskStatuses'
  }
};

const getTRBPublicGuidanceLetterQuery = (
  guidanceLetterStatus: TRBGuidanceLetterStatus = TRBGuidanceLetterStatus.COMPLETED
): MockedQuery<
  GetTRBPublicGuidanceLetterQuery,
  GetTRBPublicGuidanceLetterQueryVariables
> => ({
  request: {
    query: GetTRBPublicGuidanceLetterDocument,
    variables: {
      id: trbRequest.id
    }
  },
  result: {
    data: {
      __typename: 'Query',
      trbRequest: {
        ...trbRequest,
        taskStatuses: {
          __typename: 'TRBTaskStatuses',
          guidanceLetterStatus
        }
      }
    }
  }
});

describe('Trb Public Guidance Letter', () => {
  it('renders from email link', async () => {
    const { findByRole, asFragment } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          getTRBGuidanceLetterInsightsQuery,
          getTRBPublicGuidanceLetterQuery()
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/guidance-letter/${id}`]}>
          <Route exact path="/trb/guidance-letter/:id">
            <PublicGuidanceLetter />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    await screen.findAllByRole('heading', {
      level: 1,
      name: i18next.t<string>('technicalAssistance:guidanceLetterForm.heading')
    });

    await findByRole('heading', {
      level: 2,
      name: i18next.t<string>(
        'technicalAssistance:guidanceLetter.requestSummary'
      )
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
              query: GetTRBPublicGuidanceLetterDocument,
              variables: {
                id
              }
            },
            error: new Error()
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/guidance-letter/${id}`]}>
          <Route exact path="/trb/guidance-letter/:id">
            <PublicGuidanceLetter />
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
          getTRBGuidanceLetterInsightsQuery,
          getTRBPublicGuidanceLetterQuery(
            TRBGuidanceLetterStatus.CANNOT_START_YET
          )
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/guidance-letter/${id}`]}>
          <Route exact path="/trb/guidance-letter/:id">
            <PublicGuidanceLetter />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    await findByRole('heading', {
      level: 4,
      name: i18next.t<string>('technicalAssistance:guidanceLetter.incomplete')
    });
  });

  it('renders from task list link', async () => {
    const { findAllByRole, asFragment } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          getTRBGuidanceLetterInsightsQuery,
          getTRBPublicGuidanceLetterQuery()
        ]}
      >
        <MemoryRouter
          initialEntries={[
            {
              pathname: `/trb/guidance-letter/${id}`,
              state: { fromTaskList: true }
            }
          ]}
        >
          <Route exact path="/trb/guidance-letter/:id">
            <PublicGuidanceLetter />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    await screen.findAllByRole('heading', {
      level: 1,
      name: i18next.t<string>('technicalAssistance:guidanceLetterForm.heading')
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
