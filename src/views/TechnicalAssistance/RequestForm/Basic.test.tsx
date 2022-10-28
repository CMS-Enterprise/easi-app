import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UpdateTrbRequestFormQuery from 'queries/UpdateTrbRequestFormQuery';

import Basic from './Basic';

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
        <MockedProvider
          mocks={[
            {
              request: {
                query: UpdateTrbRequestFormQuery,
                variables: {
                  input: {
                    component: 'Center for Medicaid and CHIP Services',
                    needsAssistanceWith: 'assistance',
                    hasSolutionInMind: false,
                    proposedSolution: '',
                    whereInProcess: 'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
                    hasExpectedStartEndDates: false,
                    expectedStartDate: '',
                    expectedEndDate: '',
                    collabGroups: ['SECURITY'],
                    collabDateSecurity: '2022-10-24T16:39:56.116105Z',
                    collabDateEnterpriseArchitecture: '',
                    collabDateCloud: '',
                    collabDatePrivacyAdvisor: '',
                    collabDateGovernanceReviewBoard: '',
                    collabDateOther: '',
                    collabGroupOther: '',
                    trbRequestId: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7'
                  },
                  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                  name: 'Draft'
                }
              },
              result: {
                data: {
                  updateTRBRequest: {
                    id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                    name: 'Draft',
                    form: {
                      id: '452cf444-69b2-41a9-b8ab-ed354d209307',
                      component: 'Center for Medicaid and CHIP Services',
                      needsAssistanceWith: 'assistance',
                      hasSolutionInMind: false,
                      proposedSolution: null,
                      whereInProcess: 'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
                      whereInProcessOther: null,
                      hasExpectedStartEndDates: false,
                      expectedStartDate: null,
                      expectedEndDate: null,
                      collabGroups: ['SECURITY'],
                      collabDateSecurity: '2022-10-24T16:39:56.116105Z',
                      collabDateEnterpriseArchitecture: null,
                      collabDateCloud: null,
                      collabDatePrivacyAdvisor: null,
                      collabDateGovernanceReviewBoard: null,
                      collabDateOther: null,
                      collabGroupOther: null,
                      __typename: 'TRBRequestForm'
                    },
                    __typename: 'TRBRequest'
                  },
                  updateTRBRequestForm: {
                    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
                    __typename: 'TRBRequestForm'
                  }
                }
              }
            }
          ]}
          addTypename={false}
        >
          <Basic
            request={{
              id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
              name: 'Draft',
              form: {
                id: '452cf444-69b2-41a9-b8ab-ed354d209307',
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
            refreshRequest={() => {}}
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
    userEvent.type(
      getByLabelText(/When did you meet with them\?/),
      '2022-10-24T16:39:56.116105Z'
    );

    // Submit success
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(formErrorText).not.toBeInTheDocument();
    });
  });
});
