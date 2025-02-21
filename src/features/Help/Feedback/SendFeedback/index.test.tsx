import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SendReportAProblemEmailDocument } from 'gql/generated/graphql';
import SendFeedbackEmailQuery from 'gql/legacyGQL/SendFeedbackEmailQuery';

import ReportAProblem from '../ReportAProblem/ReportAProblem';

import SendFeedback from '.';

describe('Help forms', () => {
  it('submits the "Send Feedback" form successfully after a failed attempt', async () => {
    const { asFragment, findByText, getByLabelText, getByRole, getByTestId } =
      render(
        <MemoryRouter initialEntries={['/help/send-feedback']}>
          <Route path="/help/send-feedback">
            <MockedProvider
              mocks={[
                {
                  request: {
                    query: SendFeedbackEmailQuery,
                    variables: {
                      input: {
                        howCanWeImprove: 'improve',
                        howSatisfied: 'Very satisfied',
                        hadAccessToInformation: 'Agree',
                        questionsWereRelevant: 'Agree',
                        didntNeedHelpAnswering: 'Agree',
                        systemEasyToUse: 'Agree',
                        cmsRole: 'role',
                        easiServicesUsed: ['IT Governance'],
                        canBeContacted: false,
                        isAnonymous: true
                      }
                    }
                  },
                  result: {
                    data: {
                      sendFeedbackEmail: 'Feedback sent successfully'
                    }
                  }
                }
              ]}
              addTypename={false}
            >
              <SendFeedback />
            </MockedProvider>
          </Route>
        </MemoryRouter>
      );

    // Snapshot of the form's initial state
    expect(asFragment()).toMatchSnapshot();

    // Fill incomplete form
    userEvent.click(getByTestId('isAnonymous-yes'));

    const submitButton = getByRole('button', { name: 'Send feedback' });
    userEvent.click(submitButton);

    // Submit validation error
    const formErrorText = await findByText('Please check and fix the form');
    expect(formErrorText).toBeInTheDocument();

    // Continue to fill out the minimum required
    userEvent.click(getByTestId('easiServicesUsed-itGovernance'));
    userEvent.type(getByLabelText('What is your role at CMS?'), 'role');
    userEvent.click(getByTestId('systemEasyToUse-agree'));
    userEvent.click(getByTestId('didntNeedHelpAnswering-agree'));
    userEvent.click(getByTestId('questionsWereRelevant-agree'));
    userEvent.click(getByTestId('hadAccessToInformation-agree'));
    userEvent.click(getByTestId('howSatisfied-verySatisfied'));
    userEvent.type(getByLabelText('How can we improve EASi?'), 'improve');

    userEvent.click(submitButton);

    // Submit success
    await waitFor(() => {
      expect(formErrorText).not.toBeInTheDocument();
    });
    await findByText('Thank you for your feedback');

    // Snapshot form submission complete state
    expect(asFragment()).toMatchSnapshot();
  });

  it('submits the "Report A Problem" form successfully after a failed attempt', async () => {
    const { asFragment, findByText, getByLabelText, getByRole, getByTestId } =
      render(
        <MemoryRouter initialEntries={['/help/report-a-problem']}>
          <Route path="/help/report-a-problem">
            <MockedProvider
              mocks={[
                {
                  request: {
                    query: SendReportAProblemEmailDocument,
                    variables: {
                      input: {
                        isAnonymous: true,
                        canBeContacted: false,
                        easiService: 'IT Governance',
                        whatWereYouDoing: 'were',
                        whatWentWrong: 'went',
                        howSevereWasTheProblem:
                          'It prevented me from completing my task'
                      }
                    }
                  },
                  result: {
                    data: {
                      sendReportAProblemEmail: 'Feedback sent successfully'
                    }
                  }
                }
              ]}
              addTypename={false}
            >
              <ReportAProblem />
            </MockedProvider>
          </Route>
        </MemoryRouter>
      );

    // Snapshot of the form's initial state
    expect(asFragment()).toMatchSnapshot();

    // Fill incomplete form
    userEvent.click(getByTestId('isAnonymous-yes'));

    const submitButton = getByRole('button', { name: 'Send report' });
    userEvent.click(submitButton);

    // Submit validation error
    const formErrorText = await findByText('Please check and fix the form');
    expect(formErrorText).toBeInTheDocument();

    // Continue to fill out the minimum required
    userEvent.click(getByTestId('easiService-itGovernance'));
    userEvent.type(getByLabelText('What were you doing?'), 'were');
    userEvent.type(getByLabelText('What went wrong?'), 'went');
    userEvent.click(getByTestId('howSevereWasTheProblem-itPreventedMe'));

    userEvent.click(submitButton);

    // Submit success
    await waitFor(() => {
      expect(formErrorText).not.toBeInTheDocument();
    });
    await findByText('Thank you for your feedback');

    // Snapshot form submission complete state
    expect(asFragment()).toMatchSnapshot();
  });
});
