import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import { CFACTS } from 'constants/externalUrls';

import ExternalLinkAndModal from './index';

describe('The ExternalLinkAndModal component', async () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders an external link', async () => {
    render(
      <ExternalLinkAndModal href="https://www.example.com">
        Example
      </ExternalLinkAndModal>
    );

    expect(screen.getByRole('button', { name: 'Example' })).toBeInTheDocument();
  });

  it('renders the GENERIC external link modal', async () => {
    render(
      <ExternalLinkAndModal href="https://www.example.com">
        Example
      </ExternalLinkAndModal>
    );

    await user.click(screen.getByRole('button', { name: 'Example' }));

    const modalTitle = screen.getByText(
      i18next.t<string>('externalLinkModal:genericHeading')
    );
    expect(modalTitle).toBeInTheDocument();

    const genericModalText = screen.getByText(
      i18next.t<string>('externalLinkModal:description.generic')
    );
    expect(genericModalText).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Open in a new tab' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('button', { name: 'Go back to EASi' })
    ).toBeInTheDocument();
  });

  it('renders the CFACTS external link modal', async () => {
    render(
      <ExternalLinkAndModal href={CFACTS} modalType="CFACTS">
        Example
      </ExternalLinkAndModal>
    );

    await user.click(screen.getByRole('button', { name: 'Example' }));

    const cfactsModalText = screen.getByText(
      i18next.t<string>('externalLinkModal:description.cfacts')
    );
    expect(cfactsModalText).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Open in a new tab' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', CFACTS);
    expect(link).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('button', { name: 'Go back to EASi' })
    ).toBeInTheDocument();
  });

  it('closes the modal when the link is clicked', async () => {
    render(
      <ExternalLinkAndModal href="https://www.example.com">
        Go to example
      </ExternalLinkAndModal>
    );

    await user.click(screen.getByRole('button', { name: 'Go to example' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Open in a new tab' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
