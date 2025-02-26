import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables,
  TRBAttendConsultStatus,
  TRBCollabGroupOption,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBGuidanceLetterStatus,
  TRBRequestType,
  TRBSubjectAreaOption,
  TRBWhereInProcessOption
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import { requester } from 'tests/mock/trbRequest';

import { MessageProvider } from 'hooks/useMessage';
import { TRBRequestState } from 'types/graphql-global-types';

import Check from './Check';

const mockTrbRequestData: GetTRBRequestQuery['trbRequest'] = {
  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
  name: 'Lorem ipsum dolor sit amet, consectetur',
  state: TRBRequestState.OPEN,
  taskStatuses: {
    __typename: 'TRBTaskStatuses',
    formStatus: TRBFormStatus.IN_PROGRESS,
    feedbackStatus: TRBFeedbackStatus.READY_TO_START,
    consultPrepStatus: TRBConsultPrepStatus.READY_TO_START,
    attendConsultStatus: TRBAttendConsultStatus.READY_TO_SCHEDULE,
    guidanceLetterStatus: TRBGuidanceLetterStatus.READY_TO_START
  },
  feedback: [],
  type: TRBRequestType.NEED_HELP,
  form: {
    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
    component: 'CCSQ',
    needsAssistanceWith:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas gravida tristique maecenas. Id id ipsum, purus ac ornare. A, ut et et, sollicitudin turpis sit porta. Enim, dictumst eu vulputate et lacus et habitant. Sit quisque gravida condimentum augue erat mauris metus, arcu. Malesuada posuere fames integer sed eu tortor vel. Non scelerisque elementum auctor urna consectetur. Ut eget hendrerit massa pharetra pellentesque dolor risus in. In pellentesque vitae ac porttitor amet lacinia id. Cursus amet tortor posuere pharetra et augue eros, lorem vitae. Sit viverra cursus cras consequat, ut amet.',
    hasSolutionInMind: true,
    proposedSolution:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas gravida tristique maecenas. Id id ipsum, purus ac ornare. A, ut et et, sollicitudin turpis sit porta. Enim, dictumst eu vulputate et lacus et habitant. Sit quisque gravida condimentum augue erat mauris metus, arcu. Malesuada posuere fames integer sed eu tortor vel. Non scelerisque elementum auctor urna consectetur. Ut eget hendrerit massa pharetra pellentesque dolor risus in.',
    whereInProcess: TRBWhereInProcessOption.OTHER,
    whereInProcessOther: 'A different brainstorm',
    hasExpectedStartEndDates: true,
    expectedStartDate: '2023-01-05T05:00:00Z',
    expectedEndDate: null,
    systemIntakes: [],
    collabGroups: [TRBCollabGroupOption.SECURITY, TRBCollabGroupOption.OTHER],
    collabDateSecurity: '06/01/2023',
    collabDateEnterpriseArchitecture: null,
    collabDateCloud: null,
    collabDatePrivacyAdvisor: null,
    collabDateGovernanceReviewBoard: null,
    collabDateOther: 'Lorem ipsum dolor',
    collabGroupOther: 'Consectetur',
    collabGRBConsultRequested: null,
    subjectAreaOptions: [
      TRBSubjectAreaOption.ARTIFICIAL_INTELLIGENCE,
      TRBSubjectAreaOption.ACCESSIBILITY_COMPLIANCE,
      TRBSubjectAreaOption.CLOUD_MIGRATION
    ],
    subjectAreaOptionOther: 'A few other subjects',
    fundingSources: null,
    submittedAt: '2023-01-23T20:06:52.123703Z',
    __typename: 'TRBRequestForm'
  },
  relatedTRBRequests: [],
  relatedIntakes: [],
  __typename: 'TRBRequest'
};

const mockRefetch = async (
  variables?: Partial<GetTRBRequestQueryVariables> | undefined
): Promise<ApolloQueryResult<GetTRBRequestQuery>> => {
  return {
    loading: false,
    networkStatus: NetworkStatus.ready,
    data: {
      __typename: 'Query',
      trbRequest: mockTrbRequestData
    }
  };
};

describe('Trb Request form: Check and submit', () => {
  it('renders request form field values', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: requester?.userInfo?.euaUserId,
        name: requester?.userInfo?.commonName
      }
    });
    const { asFragment, getByText, getByRole } = render(
      <MemoryRouter>
        <MockedProvider>
          <Provider store={store}>
            <MessageProvider>
              <Check
                request={mockTrbRequestData}
                stepUrl={{
                  current:
                    '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/basic',
                  next: '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/subject',
                  back: '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/undefined'
                }}
                refetchRequest={mockRefetch}
                setIsStepSubmitting={() => {}}
                setStepSubmit={() => {}}
                setFormAlert={() => {}}
                taskListUrl=""
              />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check some strings for the correct formatting
    // Submitted date
    getByText('January 23, 2023');
    // Request type
    getByText('I’m having a problem with my system');
    // Where in process "other" field
    getByText('Other: A different brainstorm');
    // Expected start date
    getByText('Yes, 01/05/2023 expected start');
    // Oit groups with other
    getByText('Security (06/01/2023), Other: Consectetur (Lorem ipsum dolor)');
    // Net sec options
    getByText('Access Control and Identity Management');
    // App dev with other
    getByText('Cloud Migration');
    // Others with no topics
    getByText('A few other subjects');

    // Snapshot of stuff in place
    expect(asFragment()).toMatchSnapshot();

    // Submit Request is available
    const submitButton = getByRole('button', { name: 'Submit request' });
    expect(submitButton).not.toBeDisabled();
  });
});
