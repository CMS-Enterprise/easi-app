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
  const classNames = classnames('desktop:margin-top-2', className);
  return (
    <div className={classNames}>
      <Dropdown
        className="margin-top-0 width-auto"
        id="table-page-size"
        name="tablePageSize"
        onChange={(e: any) => setPageSize(Number(e.target.value))}
        value={pageSize}
      >
        <option value={10}>10 results per page</option>
        <option value={20}>25 results per page</option>
        <option value={50}>50 results per page</option>
        <option value={100}>100 results per page</option>
      </Dropdown>
    </div>
  );
};

export default TablePageSize;
