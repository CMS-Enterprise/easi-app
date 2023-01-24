import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TRBRequestType, TRBRequestStatus } from 'types/graphql-global-types';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';

import Basic from './Basic';

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
  createdAt: '2021-06-10T19:22:40Z',
  type: TRBRequestType.NEED_HELP,
  status: TRBRequestStatus.OPEN,
  taskStatuses: {} as any,
  trbLead: '',
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

describe('Trb Request form: Basic', () => {
  it('submits the form successfully after a failed attempt', async () => {
    const {
      asFragment,
      findByText,
      getByLabelText,
      getByRole,
      getByTestId
    } = render(
      <MemoryRouter>
        <MockedProvider>
          <Basic
            request={{
              id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
              name: 'Draft',
              createdBy: 'SF13',
              form: {
                ...mockEmptyFormFields,
                id: '452cf444-69b2-41a9-b8ab-ed354d209307',
                __typename: 'TRBRequestForm'
              },
              createdAt: '2021-06-10T19:22:40Z',
              type: TRBRequestType.NEED_HELP,
              status: TRBRequestStatus.OPEN,
              taskStatuses: {} as any,
              trbLead: '',
              __typename: 'TRBRequest'
            }}
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
        </MockedProvider>
      </MemoryRouter>
    );

    // Snapshot of the form's initial state
    expect(asFragment()).toMatchSnapshot();

    Element.prototype.scrollIntoView = jest.fn();

    // Submit validation error with incomplete form
    const submitButton = getByRole('button', { name: 'Next' });
    userEvent.click(submitButton);

    const formErrorText = await findByText(
      'Please check and fix the following'
    );
    expect(formErrorText).toBeInTheDocument();

    // Continue to fill out the minimum required
    userEvent.selectOptions(getByTestId('component'), [
      'Center for Medicaid and CHIP Services'
    ]);
    userEvent.type(
      getByLabelText(/What do you need technical assistance with\?/),
      'assistance'
    );
    userEvent.click(getByTestId('hasSolutionInMind-no'));
    userEvent.selectOptions(getByTestId('whereInProcess'), [
      'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM'
    ]);
    userEvent.click(getByTestId('hasExpectedStartEndDates-no'));
    userEvent.click(getByLabelText('Security'));
    userEvent.type(getByLabelText(/When did you meet with them\?/), '10/2022');

    // Submit success
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(formErrorText).not.toBeInTheDocument();
    });
  });
});
