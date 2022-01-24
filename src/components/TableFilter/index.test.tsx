import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GlobalClientFilter from './index';

describe('Table Filter Componenet', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <GlobalClientFilter
        setGlobalFilter={() => true}
        tableID="table-id"
        tableName="table-name"
        className="margin-bottom-5"
      />
    );

    expect(getByTestId('table-client-filter')).toBeInTheDocument();
  });

  it('display query text in input', () => {
    render(
      <GlobalClientFilter
        setGlobalFilter={() => true}
        tableID="table-id"
        tableName="table-name"
        className="margin-bottom-5"
      />
    );

    userEvent.type(screen.getByRole('searchbox'), 'system-1');
    expect(screen.getByRole('searchbox')).toHaveValue('system-1');
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <GlobalClientFilter
        setGlobalFilter={() => true}
        tableID="table-id"
        tableName="table-name"
        className="margin-bottom-5"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
