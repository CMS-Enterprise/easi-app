import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBReviewType } from 'gql/generated/graphql';
import { grbPresentationLinks, systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import PresentationLinksForm from '.';

describe('GRB presentation links form', () => {
  it('renders the form', () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <PresentationLinksForm
              id={systemIntake.id}
              grbReviewType={SystemIntakeGRBReviewType.ASYNC}
              grbPresentationLinks={null}
              grbReviewAsyncRecordingTime={null}
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Add presentation links' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'If this GRB review has an asynchronous presentation and recording, add that content in the fields below to provide additional information for GRB reviews.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', {
        name: "Don't add and return to request details"
      })
    ).toHaveLength(2);

    // Button should be disabled if form is empty
    expect(
      screen.getByRole('button', { name: 'Save presentation details' })
    ).toBeDisabled();
  });

  it('renders the edit links form', () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <PresentationLinksForm
              id={systemIntake.id}
              grbReviewType={SystemIntakeGRBReviewType.ASYNC}
              grbPresentationLinks={grbPresentationLinks}
              grbReviewAsyncRecordingTime="2025-07-10T12:00:00Z"
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Edit presentation links' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Update the content for this GRB review’s asynchronous presentation and recording.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', {
        name: "Don't edit and return to request details"
      })
    ).toHaveLength(2);

    expect(screen.getByRole('textbox', { name: 'Recording link' })).toHaveValue(
      'https://google.com'
    );

    expect(screen.getByText('presentationDeck.pptx')).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: 'Asynchronous presentation recording date'
      })
    ).toHaveValue('07/10/2025');

    // Button should be disabled before any changes are made
    expect(
      screen.getByRole('button', { name: 'Save presentation details' })
    ).toBeDisabled();
  });

  it('hides the async presentation recording date field for standard meetings', () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <PresentationLinksForm
              id={systemIntake.id}
              grbReviewType={SystemIntakeGRBReviewType.STANDARD}
              grbPresentationLinks={grbPresentationLinks}
              grbReviewAsyncRecordingTime={null}
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('textbox', {
        name: 'Asynchronous presentation recording date'
      })
    ).not.toBeInTheDocument();
  });
});
