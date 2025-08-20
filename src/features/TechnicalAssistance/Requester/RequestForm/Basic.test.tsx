import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables,
  TRBRequestState,
  TRBRequestType
} from 'gql/generated/graphql';

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
  systemIntakes: [],
  collabGroups: [],
  collabDateSecurity: null,
  collabDateEnterpriseArchitecture: null,
  collabDateCloud: null,
  collabDatePrivacyAdvisor: null,
  collabDateGovernanceReviewBoard: null,
  collabDateOther: null,
  collabGroupOther: null,
  collabGRBConsultRequested: null,
  subjectAreaOptions: null,
  subjectAreaOptionOther: null,
  fundingSources: null,
  submittedAt: '2023-01-31T16:23:06.111436Z'
};

const mockTrbRequestData: GetTRBRequestQuery['trbRequest'] = {
  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
  name: 'Draft',
  form: {
    ...mockEmptyFormFields,
    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
    __typename: 'TRBRequestForm'
  },
  type: TRBRequestType.NEED_HELP,
  state: TRBRequestState.OPEN,
  taskStatuses: {} as any,
  feedback: [],
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

describe('Trb Request form: Basic', () => {
  it('submits the form successfully after a failed attempt', async () => {
    const user = userEvent.setup();
    const { asFragment, findByText, getByLabelText, getByRole, getByTestId } =
      render(
        <MemoryRouter>
          <MockedProvider>
            <Basic
              request={{
                id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                name: 'Draft',
                form: {
                  ...mockEmptyFormFields,
                  id: '452cf444-69b2-41a9-b8ab-ed354d209307',
                  __typename: 'TRBRequestForm'
                },
                feedback: [],
                type: TRBRequestType.NEED_HELP,
                state: TRBRequestState.OPEN,
                taskStatuses: {} as any,
                relatedTRBRequests: [],
                relatedIntakes: [],
                __typename: 'TRBRequest'
              }}
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
          </MockedProvider>
        </MemoryRouter>
      );

    // Snapshot of the form's initial state
    expect(asFragment()).toMatchSnapshot();

    Element.prototype.scrollIntoView = vi.fn();

    // Submit validation error with incomplete form
    const submitButton = getByRole('button', { name: 'Next' });
    await user.click(submitButton);

    const formErrorText = await findByText(
      'Please check and fix the following'
    );
    expect(formErrorText).toBeInTheDocument();

    // Continue to fill out the minimum required
    await user.selectOptions(getByTestId('component'), [
      'Center for Medicaid and CHIP Services'
    ]);
    await user.type(
      getByLabelText(/What do you need technical assistance with\?/),
      'assistance'
    );
    await user.click(getByTestId('hasSolutionInMind-no'));
    await user.selectOptions(getByTestId('whereInProcess'), [
      'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM'
    ]);
    await user.click(getByTestId('hasExpectedStartEndDates-no'));
    await user.click(getByLabelText('Security'));
    await user.type(getByLabelText(/When did you meet with them\?/), '10/2022');

    // Submit success
    await user.click(submitButton);
    await waitFor(() => {
      expect(formErrorText).not.toBeInTheDocument();
    });
  });
});
