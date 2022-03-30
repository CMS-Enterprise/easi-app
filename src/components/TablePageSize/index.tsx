import React from 'react';
import { Dropdown } from '@trussworks/react-uswds';
import classnames from 'classnames';

type TablePageSizeProps = {
  className?: string;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
};

const TablePageSize = ({
  className,
  pageSize,
  setPageSize
}: TablePageSizeProps) => {
  const classNames = classnames('margin-top-2', 'grid-col-3', className);
  return (
    <Dropdown
      id="table-page-size"
      name="tablePageSize"
      onChange={(e: any) => setPageSize(Number(e.target.value))}
      className={classNames}
      value={pageSize}
    >
      <option value={10}>10 results per page</option>
      <option value={20}>25 results per page</option>
      <option value={50}>50 results per page</option>
      <option value={100}>100 results per page</option>
    </Dropdown>
  );
};

export default TablePageSize;
