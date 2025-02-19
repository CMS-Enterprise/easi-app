import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBPresentationLinks } from 'gql/generated/graphql';
import { systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import PresentationLinksForm from '.';

describe('GRB presentation links form', () => {
  it('renders the form', () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <PresentationLinksForm {...systemIntake} />
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
              {...systemIntake}
              grbPresentationLinks={
                {
                  recordingLink: 'http://google.com',
                  presentationDeckFileName: 'test.pdf'
                } as SystemIntakeGRBPresentationLinks
              }
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Edit presentation link' })
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
      'http://google.com'
    );

    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    // Button should be disabled before any changes are made
    expect(
      screen.getByRole('button', { name: 'Save presentation details' })
    ).toBeDisabled();
  });
});
