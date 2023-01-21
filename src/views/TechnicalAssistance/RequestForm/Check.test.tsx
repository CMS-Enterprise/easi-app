import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { requester } from 'data/mock/trbRequest';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';
import {
  TRBApplicationDevelopmentOption,
  TRBCollabGroupOption,
  TRBNetworkAndSecurityOption,
  TRBWhereInProcessOption
} from 'types/graphql-global-types';

import Check from './Check';

const mockTrbRequestData: TrbRequest = {
  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
  name: 'Lorem ipsum dolor sit amet, consectetur',
  createdBy: 'SF13',
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
    collabGroups: [TRBCollabGroupOption.SECURITY, TRBCollabGroupOption.OTHER],
    collabDateSecurity: '06/01/2023',
    collabDateEnterpriseArchitecture: null,
    collabDateCloud: null,
    collabDatePrivacyAdvisor: null,
    collabDateGovernanceReviewBoard: null,
    collabDateOther: 'Lorem ipsum dolor',
    collabGroupOther: 'Consectetur',
    subjectAreaTechnicalReferenceArchitecture: [],
    subjectAreaNetworkAndSecurity: [
      TRBNetworkAndSecurityOption.GENERAL_NETWORK_AND_SECURITY_SERVICES_INFORMATION,
      TRBNetworkAndSecurityOption.ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT
    ],
    subjectAreaCloudAndInfrastructure: [],
    subjectAreaApplicationDevelopment: [
      TRBApplicationDevelopmentOption.OPEN_SOURCE_SOFTWARE,
      TRBApplicationDevelopmentOption.BUSINESS_INTELLIGENCE,
      TRBApplicationDevelopmentOption.EMAIL_INTEGRATION,
      TRBApplicationDevelopmentOption.OTHER
    ],
    subjectAreaDataAndDataManagement: [],
    subjectAreaGovernmentProcessesAndPolicies: [],
    subjectAreaOtherTechnicalTopics: [],
    subjectAreaTechnicalReferenceArchitectureOther: null,
    subjectAreaNetworkAndSecurityOther: null,
    subjectAreaCloudAndInfrastructureOther: null,
    subjectAreaApplicationDevelopmentOther: 'Lorem ipsum dolor',
    subjectAreaDataAndDataManagementOther: null,
    subjectAreaGovernmentProcessesAndPoliciesOther: null,
    subjectAreaOtherTechnicalTopicsOther: null,
    __typename: 'TRBRequestForm'
  },
  __typename: 'TRBRequest'
};

const mockRefetch = async (
  variables?: Partial<GetTrbRequestVariables> | undefined
): Promise<ApolloQueryResult<GetTrbRequest>> => {
  return {
    loading: false,
    networkStatus: NetworkStatus.ready,
    data: {
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
    const { asFragment, getByText, getAllByText, getByRole } = render(
      <MemoryRouter>
        <MockedProvider>
          <Provider store={store}>
            <Check
              request={mockTrbRequestData}
              stepUrl={{
                current:
                  '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/basic',
                next:
                  '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/subject',
                back:
                  '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/undefined'
              }}
              refetchRequest={mockRefetch}
              setIsStepSubmitting={() => {}}
              setStepSubmit={() => {}}
              setFormAlert={() => {}}
              taskListUrl=""
            />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check some strings for the correct formatting
    // Where in process "other" field
    getByText('Other: A different brainstorm');
    // Expected start date
    getByText('Yes, 01/05/2023 expected start');
    // Oit groups with other
    getByText('Security (06/01/2023), Other: Consectetur (Lorem ipsum dolor)');
    // Net sec options
    getByText(
      'General network and security services information, Access control and identity management'
    );
    // App dev with other
    getByText(
      'Open source software, Business intelligence, Email integration, Other: Lorem ipsum dolor'
    );
    // Others with no topics
    expect(getAllByText('No topics selected')).toHaveLength(5);

    // Snapshot of stuff in place
    expect(asFragment()).toMatchSnapshot();

    // Submit Request is available
    const submitButton = getByRole('button', { name: 'Submit request' });
    expect(submitButton).not.toBeDisabled();
  });
});
