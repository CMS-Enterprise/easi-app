import React from 'react';
import { render } from '@testing-library/react';

import FundingSourcesTable from '.';

describe('FundingSourcesTable', () => {
  it('renders the table', () => {
    const fundingSource = {
      projectNumber: '123456',
      investments: ['Fed Admin', 'Research']
    };

    const { getByRole } = render(
      <FundingSourcesTable fundingSources={[fundingSource]} />
    );

    expect(getByRole('table')).toBeInTheDocument();

    expect(getByRole('cell', { name: '123456' })).toBeInTheDocument();
    expect(
      getByRole('cell', { name: 'Fed Admin, Research' })
    ).toBeInTheDocument();
  });

  it('renders the actions column if removeFundingSource is provided', () => {
    const { getByRole } = render(
      <FundingSourcesTable fundingSources={[]} removeFundingSource={() => {}} />
    );

    expect(getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
  });

  it('hides the actions column if removeFundingSource is not provided', () => {
    const { queryByRole } = render(<FundingSourcesTable fundingSources={[]} />);

    expect(
      queryByRole('columnheader', { name: 'Actions' })
    ).not.toBeInTheDocument();
  });
});
