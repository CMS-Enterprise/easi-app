import React from 'react';
import { render } from '@testing-library/react';

import TablePagination from './index';

describe('TablePagination', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <TablePagination
        gotoPage={() => null}
        previousPage={() => null}
        nextPage={() => null}
        canNextPage={false}
        pageIndex={0}
        pageOptions={[]}
        canPreviousPage={false}
        pageCount={0}
        pageSize={0}
        setPageSize={() => null}
        page={[]}
        data-testid="table-pagination"
      />
    );

    expect(getByTestId('table-pagination')).toBeInTheDocument();
  });
});
