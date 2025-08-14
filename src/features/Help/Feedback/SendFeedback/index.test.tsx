import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SendFeedbackEmailDocument,
  SendReportAProblemEmailDocument
} from 'gql/generated/graphql';

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
                    query: SendFeedbackEmailDocument,
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
    const user = userEvent.setup();

    // Snapshot of the form's initial state
    expect(asFragment()).toMatchSnapshot();

    // Fill incomplete form
    await user.click(getByTestId('isAnonymous-yes'));

    const submitButton = getByRole('button', { name: 'Send feedback' });
    await user.click(submitButton);

    // Submit validation error
    const formErrorText = await findByText('Please check and fix the form');
    expect(formErrorText).toBeInTheDocument();

    // Continue to fill out the minimum required
    await user.click(getByTestId('easiServicesUsed-itGovernance'));
    await user.type(getByLabelText('What is your role at CMS?'), 'role');
    await user.click(getByTestId('systemEasyToUse-agree'));
    await user.click(getByTestId('didntNeedHelpAnswering-agree'));
    await user.click(getByTestId('questionsWereRelevant-agree'));
    await user.click(getByTestId('hadAccessToInformation-agree'));
    await user.click(getByTestId('howSatisfied-verySatisfied'));
    await user.type(getByLabelText('How can we improve EASi?'), 'improve');

    await user.click(submitButton);

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

    const user = userEvent.setup();

    // Snapshot of the form's initial state
    expect(asFragment()).toMatchSnapshot();

    // Fill incomplete form
    await user.click(getByTestId('isAnonymous-yes'));

    const submitButton = getByRole('button', { name: 'Send report' });
    await user.click(submitButton);

    // Submit validation error
    const formErrorText = await findByText('Please check and fix the form');
    expect(formErrorText).toBeInTheDocument();

    // Continue to fill out the minimum required
    await user.click(getByTestId('easiService-itGovernance'));
    await user.type(getByLabelText('What were you doing?'), 'were');
    await user.type(getByLabelText('What went wrong?'), 'went');
    await user.click(getByTestId('howSevereWasTheProblem-itPreventedMe'));

    await user.click(submitButton);

    // Submit success
    await waitFor(() => {
      expect(formErrorText).not.toBeInTheDocument();
    });
    await findByText('Thank you for your feedback');

    // Snapshot form submission complete state
    expect(asFragment()).toMatchSnapshot();
  });
});
