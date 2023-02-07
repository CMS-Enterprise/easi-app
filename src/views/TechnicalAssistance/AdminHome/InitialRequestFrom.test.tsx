import React from 'react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { requester } from 'data/mock/trbRequest';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import { GetTrbRequest_trbRequest as TrbRequest } from 'queries/types/GetTrbRequest';
import {
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBRequestType
} from 'types/graphql-global-types';

import InitialRequestForm from './InitialRequestForm';

const mockTrbRequestData: TrbRequest = {
  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
  name: 'Lorem ipsum dolor sit amet, consectetur',
  createdBy: 'SF13',
  type: TRBRequestType.NEED_HELP,
  taskStatuses: {
    formStatus: TRBFormStatus.IN_PROGRESS,
    feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
    consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
    attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
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
  __typename: 'TRBRequest'
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
    const {
      asFragment,
      getByText,
      queryByText,
      queryAllByText,
      findByText
    } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: GetTrbRequestQuery,
              variables: { id: mockTrbRequestData.id }
            },
            result: { data: { trbRequest: mockTrbRequestData } }
          }
        ]}
      >
        <Provider store={store}>
          <InitialRequestForm trbRequestId={mockTrbRequestData.id} />
        </Provider>
      </MockedProvider>
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

    expect(asFragment()).toMatchSnapshot();
  });
});
