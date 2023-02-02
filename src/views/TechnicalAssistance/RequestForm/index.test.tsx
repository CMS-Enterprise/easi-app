import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { requester } from 'data/mock/trbRequest';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';

import RequestForm from '.';

function renderFeedbackTest() {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: requester?.userInfo?.euaUserId,
      name: requester?.userInfo?.commonName
    }
  });
  return render(
    <MemoryRouter
      initialEntries={[
        '/trb/requests/f727cb0d-5ba1-40a3-8172-00e4ce86da3c/basic'
      ]}
    >
      <MockedProvider
        mocks={[
          {
            request: {
              query: GetTrbRequestQuery,
              variables: { id: 'f727cb0d-5ba1-40a3-8172-00e4ce86da3c' }
            },
            result: {
              data: {
                trbRequest: {
                  id: 'f727cb0d-5ba1-40a3-8172-00e4ce86da3c',
                  name: 'Draft',
                  createdBy: 'ABCD',
                  createdAt: '2023-01-31T16:23:06.111436Z',
                  type: 'NEED_HELP',
                  status: 'OPEN',
                  taskStatuses: {
                    formStatus: 'IN_PROGRESS',
                    feedbackStatus: 'EDITS_REQUESTED',
                    consultPrepStatus: 'CANNOT_START_YET',
                    attendConsultStatus: 'CANNOT_START_YET',
                    __typename: 'TRBTaskStatuses'
                  },
                  trbLead: null,
                  form: {
                    id: '9c1e6ece-e398-4ef7-8964-e8bca1515a93',
                    component: 'Center for Medicaid and CHIP Services',
                    needsAssistanceWith: 'x',
                    hasSolutionInMind: false,
                    proposedSolution: null,
                    whereInProcess: 'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
                    whereInProcessOther: null,
                    hasExpectedStartEndDates: false,
                    expectedStartDate: null,
                    expectedEndDate: null,
                    collabGroups: ['ENTERPRISE_ARCHITECTURE'],
                    collabDateSecurity: null,
                    collabDateEnterpriseArchitecture: 'x',
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
                  feedback: [
                    {
                      id: 'edf39ac2-ced6-4cfd-a328-a1707c2e04c7',
                      feedbackMessage:
                        'Purus morbi pellentesque eget erat. Egestas venenatis vitae pretium pretium, orci, elit praesent tortor. Turpis semper sollicitudin sagittis pellentesque est dictum. Rhoncus, nulla turpis netus praesent consequat leo orci, vel.',
                      action: 'REQUEST_EDITS',
                      author: {
                        commonName: 'George Louis Costanza',
                        __typename: 'UserInfo'
                      },
                      createdAt: '2023-01-30T16:23:34.576076Z',
                      __typename: 'TRBRequestFeedback'
                    },
                    {
                      id: 'eeb2dab6-d436-433a-90a9-673c8e9256f5',
                      feedbackMessage:
                        'Id mauris pharetra volutpat, praesent faucibus aliquam, penatibus. Convallis maecenas cras dignissim in diam duis odio maecenas. Mi amet ullamcorper dolor tempus vulputate elit a volutpat purus. Nunc, vel arcu imperdiet duis enim leo quis. Aliquam nibh tincidunt aliquam morbi non. A in porttitor suspendisse nunc turpis turpis eros, at ultrices. Scelerisque netus quisque semper ullamcorper porta interdum scelerisque elementum. Egestas enim egestas imperdiet sociis porta.',
                      action: 'REQUEST_EDITS',
                      author: {
                        commonName: 'George Louis Costanza',
                        __typename: 'UserInfo'
                      },
                      createdAt: '2023-01-31T18:22:13.029728Z',
                      __typename: 'TRBRequestFeedback'
                    }
                  ],
                  __typename: 'TRBRequest'
                }
              }
            }
          }
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <Provider store={store}>
            <RequestForm />
          </Provider>
        </Route>
      </MockedProvider>
    </MemoryRouter>
  );
}

describe('TRB Request Form Feedback', () => {
  it('shows the View feedback warning banner in the header if there are edits requested', async () => {
    const { asFragment, findByText, getByRole } = renderFeedbackTest();

    await findByText(
      i18next.t<string>('technicalAssistance:editsRequested.alert')
    );
    getByRole('link', {
      name: i18next.t<string>('technicalAssistance:editsRequested.viewFeedback')
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('goes to and renders the feedback view', async () => {
    const {
      asFragment,
      findByText,
      findByRole,
      getAllByText,
      getAllByTestId
    } = renderFeedbackTest();

    const feedbackLink = await findByRole('link', {
      name: i18next.t<string>('technicalAssistance:editsRequested.viewFeedback')
    });

    userEvent.click(feedbackLink);

    await findByText(
      i18next.t<string>('technicalAssistance:requestFeedback.heading')
    );

    // Check feedback author name
    getAllByText('George Louis Costanza');

    // Check feedback ordered by dates desc
    const sortedDates = getAllByTestId('feedback-date');
    expect(sortedDates.length).toBe(2);
    expect(sortedDates[0]).toHaveTextContent('January 31, 2023');
    expect(sortedDates[1]).toHaveTextContent('January 30, 2023');

    expect(asFragment()).toMatchSnapshot();
  });
});
