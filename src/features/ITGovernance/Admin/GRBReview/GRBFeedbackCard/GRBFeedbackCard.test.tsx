import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GetGovernanceRequestFeedbackDocument } from 'gql/generated/graphql';
import { governanceRequestFeedbacks as governanceRequestFeedbacksMock } from 'tests/mock/systemIntake';

import { getExpectedAlertType } from 'utils/testing/helpers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GRBFeedbackCard, { GRBFeedbackCardProps } from './GRBFeedbackCard';

describe('GRB Feedback Card', () => {
  function renderCard(
    governanceRequestFeedbacks: GRBFeedbackCardProps['governanceRequestFeedbacks']
  ) {
    const systemIntakeID = '1';

    return render(
      <VerboseMockedProvider
        addTypename
        mocks={[
          {
            request: {
              query: GetGovernanceRequestFeedbackDocument,
              variables: {
                intakeID: systemIntakeID
              }
            },
            result: {
              data: {
                systemIntake: {
                  id: systemIntakeID,
                  requestName: '',
                  governanceRequestFeedbacks
                }
              }
            }
          }
        ]}
      >
        <GRBFeedbackCard
          systemIntakeID={systemIntakeID}
          governanceRequestFeedbacks={governanceRequestFeedbacks}
        />
      </VerboseMockedProvider>
    );
  }

  it('renders closed', () => {
    renderCard(governanceRequestFeedbacksMock);

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    screen.getByRole('button', { name: 'Show GRT recommendations' });
  });

  it('renders expanded', async () => {
    renderCard(governanceRequestFeedbacksMock);

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    expect(screen.queryByTestId('grb-feedback-list')).not.toBeInTheDocument();

    const expand = screen.getByRole('button', {
      name: 'Show GRT recommendations'
    });
    userEvent.click(expand);

    // Check that the list element is in the document
    // It is not part of the dom tree when "collapsed"
    await screen.findByTestId('feedback-list');

    // Check some feedback content
    screen.getByText(
      'grb recommendations for INITIAL_REQUEST_FORM progressing to DRAFT_BUSINESS_CASE'
    );
  });

  it('renders empty', () => {
    renderCard([]);

    expect(getExpectedAlertType('info')).toHaveTextContent(
      'The Governance Review Team (GRT) did not provide recommendations or feedback for this project.'
    );

    expect(
      screen.queryByRole('link', { name: 'Show GRT recommendations' })
    ).not.toBeInTheDocument();
  });
});
