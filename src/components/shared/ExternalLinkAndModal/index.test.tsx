import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import { CFACTS } from 'constants/externalUrls';

import ExternalLinkAndModal from './index';

describe('The ExternalLinkAndModal component', async () => {
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

    userEvent.click(screen.getByRole('button', { name: 'Example' }));

    const modalTitle = await screen.findByText(
      'Are you sure you want to leave EASi?'
    );
    expect(modalTitle).toBeInTheDocument();

    const genericModalText = screen.getByText(
      'If you are accessing another CMS system or site, it could require connectivity via VPN and/or job codes and permissions to access content.'
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

    userEvent.click(screen.getByRole('button', { name: 'Example' }));

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
});
