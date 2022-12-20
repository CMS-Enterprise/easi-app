import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';

import Documents from './Documents';

const mockEmptyFormFields = {
  component: null,
  needsAssistanceWith: null,
  hasSolutionInMind: null,
  proposedSolution: null,
  whereInProcess: null,
  whereInProcessOther: null,
  hasExpectedStartEndDates: null,
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
  subjectAreaOtherTechnicalTopicsOther: null
};

const mockTrbRequestData: TrbRequest = {
  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
  name: 'Draft',
  createdBy: 'SF13',
  form: {
    ...mockEmptyFormFields,
    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
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

const documents = (
  <Documents
    request={{
      id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
      name: 'Draft',
      createdBy: 'SF13',
      form: {
        ...mockEmptyFormFields,
        id: '452cf444-69b2-41a9-b8ab-ed354d209307',
        __typename: 'TRBRequestForm'
      },
      __typename: 'TRBRequest'
    }}
    stepUrl={{ current: '', next: '', back: '' }}
    refetchRequest={mockRefetch}
    setIsStepSubmitting={() => {}}
    setStepSubmit={() => {}}
    setFormAlert={() => {}}
    taskListUrl=""
  />
);

describe('Trb Request form: Supporting documents', () => {
  it('renders states without documents', async () => {
    const { asFragment, findByRole } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider
            mocks={[
              {
                request: {
                  query: GetTrbRequestDocumentsQuery,
                  variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                },
                result: {
                  data: {
                    trbRequest: {
                      documents: []
                    }
                  }
                }
              }
            ]}
          >
            {documents}
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    // Submit button: Continue without documents
    expect(
      await findByRole('button', { name: 'Continue without adding documents' })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders states with documents loaded', async () => {
    const { asFragment, findByRole } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider
            mocks={[
              {
                request: {
                  query: GetTrbRequestDocumentsQuery,
                  variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                },
                result: {
                  data: {
                    trbRequest: {
                      documents: [
                        {
                          id: '21517ecf-a671-46f3-afec-35eebde49630',
                          fileName: 'foo.pdf',
                          documentType: {
                            commonType: 'ARCHITECTURE_DIAGRAM',
                            otherTypeDescription: ''
                          },
                          status: 'UNAVAILABLE',
                          uploadedAt: '2022-12-20T16:25:42.414064Z',
                          url:
                            'http://host.docker.internal:9000/easi-app-file-uploads/6db39281-4e14-43ed-b973-ced09732c33d.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20221220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221220T210952Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=5cc44f5a045802fac8a4720b08432d31e70ed86b990063be43b0056c74accea2'
                        },
                        {
                          id: 'd7efd8a7-4ad9-4ed3-80e4-c4b70f3498ae',
                          fileName: 'bar.pdf',
                          documentType: {
                            commonType: 'OTHER',
                            otherTypeDescription: 'test other'
                          },
                          status: 'AVAILABLE',
                          uploadedAt: '2022-12-20T19:04:12.50116Z',
                          url:
                            'http://host.docker.internal:9000/easi-app-file-uploads/483bdc9f-4e23-4288-afc1-da23692df11b.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20221220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221220T210952Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=835b79034d02ff423c255bf84a167e54b45d0a69ca5693cb80e853ed27ce2f12'
                        },
                        {
                          id: '940e062a-1f2c-4470-9bc5-d54ea9bd032e',
                          fileName: 'baz.pdf',
                          documentType: {
                            commonType: 'PRESENTATION_SLIDE_DECK',
                            otherTypeDescription: ''
                          },
                          status: 'PENDING',
                          uploadedAt: '2022-12-20T19:04:36.518916Z',
                          url:
                            'http://host.docker.internal:9000/easi-app-file-uploads/561de1eb-8efd-4a08-bdeb-1994249f6fe4.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20221220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221220T210952Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=295b461849f7c5e6357a4b3e4d93b13c617bd43ec5f4236d04d9690bc376b94f'
                        }
                      ]
                    }
                  }
                }
              }
            ]}
          >
            {documents}
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    // Submit button is "Next" when there are documents
    expect(await findByRole('button', { name: 'Next' })).toBeInTheDocument();

    // Snapshot with states demonstrated
    // - view and remove on available documents
    // - other description text in document type column
    // - all document file status types
    // - date formatting
    expect(asFragment()).toMatchSnapshot();
  });
});
