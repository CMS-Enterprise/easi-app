import React from 'react';
import { render } from '@testing-library/react';

import TablePageSize from './index';

describe('Table Page Size Componenet', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <TablePageSize
        className="desktop:grid-col-auto"
        pageSize={10}
        setPageSize={() => null}
      />
    );

    expect(getByTestId('table-page-size')).toBeInTheDocument();
  });
});
