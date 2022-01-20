import React from 'react';
import { render, screen } from '@testing-library/react';

import TableResults from './index';

describe('Table Results Componenet', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <TableResults
        globalFilter=""
        pageIndex={1}
        pageSize={10}
        filteredRowLength={0}
        rowLength={10}
      />
    );

    expect(getByTestId('page-results')).toBeInTheDocument();
  });

  it('display current page number of page size out of total pages', async () => {
    render(
      <TableResults
        globalFilter=""
        pageIndex={4}
        pageSize={10}
        filteredRowLength={0}
        rowLength={456}
      />
    );

    expect(
      await screen.getByText(/Showing 41-50 of 456 results/)
    ).toBeInTheDocument();
  });

  it('display filters results of page size out of total pages', async () => {
    render(
      <TableResults
        globalFilter="Happiness"
        pageIndex={0}
        pageSize={10}
        filteredRowLength={42}
        rowLength={456}
      />
    );

    expect(
      await screen.getByText(/Showing 1-10 of 42 results/)
    ).toBeInTheDocument();
    expect(await screen.findByText('Happiness')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <TableResults
        globalFilter=""
        pageIndex={0}
        pageSize={10}
        filteredRowLength={0}
        rowLength={100}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
