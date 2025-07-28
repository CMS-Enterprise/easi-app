import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBReviewType } from 'gql/generated/graphql';
import i18next from 'i18next';
import { grbReview } from 'tests/mock/grbReview';
import { documents } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import AdditionalDocumentation from '.';

describe('GRB review form - additional documents', () => {
  it('renders the step', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/it-governance/${grbReview.id}/grb-review/documents`]}
      >
        <VerboseMockedProvider>
          <MessageProvider>
            <Route path="/it-governance/:systemId/grb-review/:step">
              <AdditionalDocumentation
                grbReview={{ ...grbReview, documents }}
              />
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Step 3 of 4 Additional documentation'
      })
    ).toBeInTheDocument();

    // Renders the standard meeting alert
    expect(
      screen.getByText(
        i18next.t<string>(
          'grbReview:setUpGrbReviewForm.documents.standardMeetingAlert'
        )
      )
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('hides the standard meeting alert for async reviews', () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${grbReview.id}/grb-review/documents`]}
      >
        <VerboseMockedProvider>
          <MessageProvider>
            <Route path="/it-governance/:systemId/grb-review/:step">
              <AdditionalDocumentation
                grbReview={{
                  ...grbReview,
                  grbReviewType: SystemIntakeGRBReviewType.ASYNC
                }}
              />
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(
        i18next.t<string>(
          'grbReview:setUpGrbReviewForm.documents.standardMeetingAlert'
        )
      )
    ).toBeNull();
  });
});
