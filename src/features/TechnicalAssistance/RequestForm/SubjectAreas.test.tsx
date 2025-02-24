import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'gql/legacyGQL/types/GetTrbRequest';

import {
  TRBRequestState,
  TRBRequestType,
  TRBSubjectAreaOption
} from 'types/graphql-global-types';

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
  subjectAreaOptions: [TRBSubjectAreaOption.CLOUD_MIGRATION],
  subjectAreaOptionOther: null,
  fundingSources: null,
  submittedAt: '2023-01-31T16:23:06.111436Z'
};

const mockTrbRequestData: TrbRequest = {
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

function renderSubjectAreas() {
  return render(
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
            feedback: [],
            type: TRBRequestType.NEED_HELP,
            state: TRBRequestState.OPEN,
            taskStatuses: {} as any,
            relatedTRBRequests: [],
            relatedIntakes: [],
            __typename: 'TRBRequest'
          }}
          stepUrl={{
            current: '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/basic',
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
}

describe('Trb Request form: Subject areas', () => {
  it('checks subject area form elements', async () => {
    const { asFragment, getByRole, getByTestId } = renderSubjectAreas();

    expect(asFragment()).toMatchSnapshot();

    Element.prototype.scrollIntoView = vi.fn();

    // Check Next button with existing selected subject areas
    expect(getByRole('button', { name: 'Next' })).toBeInTheDocument();

    // Get existing selectedsubect area checkbox and assert it's already checked
    const checkboxCloud = getByRole('checkbox', {
      name: /Cloud Migration/i
    });
    expect(checkboxCloud).toBeChecked();

    // Unselect checkboxCloud
    userEvent.click(checkboxCloud);
    expect(checkboxCloud).not.toBeChecked();

    // Check submit button has changed in the presence of no subject areas selected
    expect(
      getByRole('button', { name: 'Continue without selecting subject areas' })
    ).toBeInTheDocument();

    // Get subect area checkbox and assert it's not checked
    const checkboxACIM = getByRole('checkbox', {
      name: /Access Control and Identity Management/i
    });
    expect(checkboxACIM).not.toBeChecked();

    // Click and assert clicked
    userEvent.click(checkboxACIM);
    expect(checkboxACIM).toBeChecked();

    // Fills text in Other subject areas textAreaField
    const textAreaInput = getByTestId('subjectAreaOptionOther');
    userEvent.type(textAreaInput, 'System Architecture Review');

    // Get typed text
    expect(textAreaInput).toHaveValue('System Architecture Review');
  });
});
