import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@trussworks/react-uswds';
import classnames from 'classnames';

type TablePageSizeProps = {
  className?: string;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  suffix?: string;
};

const Option = ({
  value,
  suffix
}: {
  value: number | 'all';
  suffix?: string; // Add word to end of page - ex: Show 10 milestones
}) => {
  const { t } = useTranslation('systemProfile');
  return (
    <option value={value}>
      {t('tableAndPagination:pageSize:show', { value })}
      {suffix && ` ${{ suffix }}`}
    </option>
  );
};

const TablePageSize = ({
  className,
  pageSize,
  setPageSize,
  suffix
}: TablePageSizeProps) => {
  const classNames = classnames('desktop:margin-top-2', className);
  return (
    <div className={classNames}>
      <Select
        className="margin-top-0 width-auto"
        id="table-page-size"
        data-testid="table-page-size"
        name="tablePageSize"
        onChange={(e: any) => setPageSize(Number(e.target.value))}
        value={pageSize}
      >
        <Option value={5} suffix={suffix} />
        <Option value={10} suffix={suffix} />
        <Option value={25} suffix={suffix} />
        <Option value={50} suffix={suffix} />
        <Option value={100} suffix={suffix} />
      </Select>
    </div>
  );
};

export default TablePageSize;
