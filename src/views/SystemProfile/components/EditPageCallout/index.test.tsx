import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import EditPageCallout from '.';

describe('Edit page callout', () => {
  const page = 'team';
  const path = `/systems/000-0000-1/${page}`;

  it('Renders the callout', () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={[path]}>
        <Route path="/systems/:systemId/:subinfo">
          <EditPageCallout />
        </Route>
      </MemoryRouter>
    );

    expect(
      getByRole('heading', {
        name: i18next.t('systemProfile:singleSystem.editPage.heading')
      })
    ).toBeInTheDocument();

    const editLink = getByRole('link', {
      name: i18next.t('systemProfile:singleSystem.editPage.buttonLabel', {
        page
      })
    });

    expect(editLink).toHaveAttribute('href', `${path}/edit`);
  });

  it('Displays date last updated', () => {
    const modifiedAt = '2024-03-28T13:20:37.852099Z';
    const { getByText } = render(
      <MemoryRouter initialEntries={[path]}>
        <Route path="/systems/:systemId/:subinfo">
          <EditPageCallout modifiedAt={modifiedAt} />
        </Route>
      </MemoryRouter>
    );

    expect(
      getByText(
        i18next.t<string>('systemProfile:singleSystem.editPage.lastUpdated', {
          lastUpdatedText: '03/28/2024',
          interpolation: { escapeValue: false }
        })
      )
    ).toBeInTheDocument();
  });
});
