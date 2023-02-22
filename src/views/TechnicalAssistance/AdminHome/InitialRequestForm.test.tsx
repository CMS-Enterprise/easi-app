import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { attendees, requester } from 'data/mock/trbRequest';
import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';
import { GetTrbRequest_trbRequest as TrbRequest } from 'queries/types/GetTrbRequest';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import {
  TRBAdviceLetterStatus,
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBRequestStatus,
  TRBRequestType
} from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import InitialRequestForm from './InitialRequestForm';

const mockTrbRequestData: TrbRequest = {
  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
  name: 'Lorem ipsum dolor sit amet, consectetur',
  type: TRBRequestType.NEED_HELP,
  status: TRBRequestStatus.OPEN,
  taskStatuses: {
    formStatus: TRBFormStatus.IN_PROGRESS,
    feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
    consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
    attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
    adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
    __typename: 'TRBTaskStatuses'
  },
  form: {
    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
    component: null,
    needsAssistanceWith: null,
    hasSolutionInMind: false,
    proposedSolution: null,
    whereInProcess: null,
    whereInProcessOther: null,
    hasExpectedStartEndDates: false,
    expectedStartDate: null,
    expectedEndDate: null,
    collabGroups: [],
    collabDateSecurity: null,
    collabDateEnterpriseArchitecture: null,
    collabDateCloud: null,
    collabDatePrivacyAdvisor: null,
    collabDateGovernanceReviewBoard: null,
    collabDateOther: null,
    collabGroupOther: null,
    subjectAreaTechnicalReferenceArchitecture: [],
    subjectAreaNetworkAndSecurity: [],
    subjectAreaCloudAndInfrastructure: [],
    subjectAreaApplicationDevelopment: [],
    subjectAreaDataAndDataManagement: [],
    subjectAreaGovernmentProcessesAndPolicies: [],
    subjectAreaOtherTechnicalTopics: [],
    subjectAreaTechnicalReferenceArchitectureOther: null,
    subjectAreaNetworkAndSecurityOther: null,
    subjectAreaCloudAndInfrastructureOther: null,
    subjectAreaApplicationDevelopmentOther: null,
    subjectAreaDataAndDataManagementOther: null,
    subjectAreaGovernmentProcessesAndPoliciesOther: null,
    subjectAreaOtherTechnicalTopicsOther: null,
    submittedAt: null,
    __typename: 'TRBRequestForm'
  },
  __typename: 'TRBRequest',
  feedback: []
};

const initialRequester: TRBAttendee = {
  ...requester,
  component: null,
  role: null
};

describe('Trb Admin Initial Request Form', () => {
  it('renders', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: requester?.userInfo?.euaUserId,
        name: requester?.userInfo?.commonName
      }
    });
    const { getByText, queryByText, queryAllByText, findByText } = render(
      <VerboseMockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbRequestQuery,
              variables: { id: mockTrbRequestData.id }
            },
            result: { data: { trbRequest: mockTrbRequestData } }
          },
          {
            request: {
              query: GetTRBRequestAttendees,
              variables: {
                id: mockTrbRequestData.id
              }
            },
            result: {
              data: {
                trbRequest: {
                  id: mockTrbRequestData.id,
                  attendees: [initialRequester, ...attendees]
                }
              }
            }
          },
          {
            request: {
              query: GetTrbRequestDocumentsQuery,
              variables: { id: mockTrbRequestData.id }
            },
            result: {
              data: {
                trbRequest: { id: mockTrbRequestData.id, documents: [] }
              }
            }
          }
        ]}
      >
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              `/trb/${mockTrbRequestData.id}/initial-request-form`
            ]}
          >
            <Route exact path="/trb/:id/:activePage">
              <InitialRequestForm trbRequestId={mockTrbRequestData.id} />
            </Route>
          </MemoryRouter>
        </Provider>
      </VerboseMockedProvider>
    );

    // Loaded okay
    await findByText(
      i18next.t<string>(
        'technicalAssistance:adminHome.subnav.initialRequestForm'
      )
    );

    // Task status tag rendered from query data
    getByText(i18next.t<string>('taskList:taskStatus.IN_PROGRESS'));

    // Admin description text of request form steps, up to Documents
    for (let stepIdx = 0; stepIdx <= 3; stepIdx += 1) {
      getByText(
        i18next.t<string>(
          `technicalAssistance:requestForm.steps.${stepIdx}.adminDescription`
        )
      );
    }

    // Shouldn't show edit section option
    expect(
      queryAllByText(i18next.t<string>('technicalAssistance:check.edit'))
    ).toHaveLength(0);

    // Shouldn't show request header info
    expect(
      queryByText(
        i18next.t<string>('technicalAssistance:table.header.submissionDate')
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(i18next.t<string>('technicalAssistance:check.requestType'))
    ).not.toBeInTheDocument();

    // Empty documents table loaded
    await findByText(
      i18next.t<string>('technicalAssistance:documents.table.noDocument')
    );
  });
});
