import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { MessageProvider } from 'hooks/useMessage';

import SystemProfileFormWrapper from './index';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

const systemId = '123';

describe('SystemProfileFormWrapper', () => {
  const MockFormProvider = ({ children }: { children: React.ReactNode }) => {
    const form = useEasiForm();

    return <EasiFormProvider {...form}>{children}</EasiFormProvider>;
  };

  it('renders the form wrapper for editable section', () => {
    const content = 'This is the section content!';
    const onSubmit = vi.fn();

    render(
      <MemoryRouter initialEntries={[`/systems/${systemId}/edit`]}>
        <MessageProvider>
          <MockFormProvider>
            <SystemProfileFormWrapper
              section={SystemProfileLockableSection.BUSINESS_INFORMATION}
              onSubmit={onSubmit}
              percentComplete={20}
            >
              {content}
            </SystemProfileFormWrapper>
          </MockFormProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    const header = screen.getByTestId('form-wrapper-header');

    expect(
      within(header).getByTestId('percent-complete-tag')
    ).toHaveTextContent(/% complete overall/);

    expect(
      within(header).getByRole('button', { name: 'Save and exit' })
    ).toBeInTheDocument();

    expect(screen.getByText(content)).toBeInTheDocument();

    const footer = screen.getByTestId('form-wrapper-footer');

    expect(
      within(footer).getByTestId('percent-complete-tag')
    ).toHaveTextContent(/% complete/);

    const buttonGroup = within(footer).getByTestId('form-wrapper-button-group');

    expect(within(buttonGroup).getAllByRole('button')).toHaveLength(2);

    expect(
      within(footer).getByRole('button', { name: 'Save and exit' })
    ).toBeInTheDocument();

    expect(
      within(footer).getByRole('button', {
        name: 'Save and continue to next section'
      })
    ).toBeInTheDocument();

    expect(
      within(footer).getByRole('link', { name: 'Exit form without saving' })
    ).toBeInTheDocument();

    expect(within(footer).getByText(/Next section:/)).toBeInTheDocument();
  });

  it('renders the form wrapper for external read-only section', () => {
    render(
      <MemoryRouter initialEntries={[`/systems/${systemId}/edit`]}>
        <MessageProvider>
          <MockFormProvider>
            <SystemProfileFormWrapper
              section={SystemProfileLockableSection.BUSINESS_INFORMATION}
              readOnly
              hasExternalData={false}
            >
              section content
            </SystemProfileFormWrapper>
          </MockFormProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    const header = screen.getByTestId('form-wrapper-header');

    expect(
      within(header).getByRole('button', { name: 'Exit form' })
    ).toBeInTheDocument();

    const footer = screen.getByTestId('form-wrapper-footer');

    expect(within(footer).getByTestId('external-data-tag')).toHaveTextContent(
      /No external data/
    );

    const buttonGroup = within(footer).getByTestId('form-wrapper-button-group');

    expect(within(buttonGroup).getAllByRole('button')).toHaveLength(1);

    expect(
      within(footer).getByRole('button', { name: 'Continue to next section' })
    ).toBeInTheDocument();

    expect(
      within(footer).getByRole('link', { name: 'Exit form' })
    ).toBeInTheDocument();

    expect(within(footer).getByText(/Next section:/)).toBeInTheDocument();
  });

  it('hides continue button and next section text for last section if read-only', () => {
    render(
      <MemoryRouter initialEntries={[`/systems/${systemId}/edit`]}>
        <MessageProvider>
          <MockFormProvider>
            <SystemProfileFormWrapper section="ATO_AND_SECURITY" readOnly>
              section content
            </SystemProfileFormWrapper>
          </MockFormProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    const footer = screen.getByTestId('form-wrapper-footer');

    expect(
      within(footer).queryByTestId('form-wrapper-button-group')
    ).not.toBeInTheDocument();

    expect(within(footer).queryByText(/Next section:/)).not.toBeInTheDocument();
  });
});
