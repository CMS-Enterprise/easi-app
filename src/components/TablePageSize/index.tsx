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
        <option value={10}>Show 10</option>
        <option value={25}>Show 25</option>
        <option value={50}>Show 50</option>
        <option value={100}>Show 100</option>
      </Dropdown>
    </div>
  );
};

export default TablePageSize;
