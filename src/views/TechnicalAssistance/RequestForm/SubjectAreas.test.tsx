import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import selectEvent from 'react-select-event';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';

import SubjectAreas from './SubjectAreas';

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
describe('Trb Request form: Subject areas', () => {
  it('submits the form successfully after a failed attempt', async () => {
    const { asFragment, findByText, getByLabelText, getByRole } = render(
      <MemoryRouter>
        <MockedProvider>
          <SubjectAreas
            request={{
              id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
              name: 'Draft',
              form: {
                ...mockEmptyFormFields,
                id: '452cf444-69b2-41a9-b8ab-ed354d209307',
                __typename: 'TRBRequestForm'
              },
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
            setFormError={() => {}}
            taskListUrl=""
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();

    Element.prototype.scrollIntoView = jest.fn();

    // This form can be skipped
    // Check initial submit button
    expect(
      getByRole('button', { name: 'Continue without selecting subject areas' })
    ).toBeInTheDocument();

    // Test on one field
    // Fields are from a loop so they should behave the same
    const fieldLabel = getByLabelText(
      /Technical Reference Architecture \(TRA\)/
    );

    // Toggle "other" field on and off
    // On
    await selectEvent.select(fieldLabel, ['Other']);
    const otherLabel = getByLabelText(/Please specify/);
    expect(otherLabel).toBeInTheDocument();
    // Off
    await selectEvent.clearFirst(fieldLabel);
    await waitFor(() => {
      expect(otherLabel).not.toBeInTheDocument();
    });

    // Select some options and toggle on the "other" field
    await selectEvent.select(
      getByLabelText(/Technical Reference Architecture \(TRA\)/),
      ['General TRA information', 'Other']
    );

    // Leave "other" empty
    // Submit validation error with incomplete form
    const submitButton = getByRole('button', { name: 'Next' });
    userEvent.click(submitButton);

    // Form error message
    const formErrorText = await findByText(
      'Please check and fix the following'
    );
    expect(formErrorText).toBeInTheDocument();

    // Field error message
    expect(
      await findByText('Technical Reference Architecture (TRA): Please specify')
    ).toBeInTheDocument();
    expect(await findByText('Please fill in the blank')).toBeInTheDocument();

    // Fix and fill the error field
    userEvent.type(getByLabelText(/Please specify/), 'testing');

    // Submit success
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(formErrorText).not.toBeInTheDocument();
    });
  });
});
