import React, { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Table } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import { convertIntakeToCSV } from 'data/systemIntake';
import { SystemIntakeForm } from 'types/systemIntake';

import csvHeaderMap from './csvHeaderMap';

import './index.scss';

type RequestRepositoryProps = {
  openIntakes: SystemIntakeForm[];
  closedIntakes: SystemIntakeForm[];
};

const RequestRepository = ({
  openIntakes,
  closedIntakes
}: RequestRepositoryProps) => {
  type TableTypes = 'open' | 'closed';
  const [activeTable, setActiveTable] = useState<TableTypes>('open');
  const { t } = useTranslation('governanceReviewTeam');

  const columns: any = useMemo(
    () => [
      {
        Header: t('intake:fields.submissionDate'),
        accessor: 'submittedAt',
        Cell: ({ value }: any) => {
          if (value) {
            return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
          }
          return t('requestRepository.table.submissionDate.null');
        }
      },
      {
        Header: t('intake:fields.projectName'),
        accessor: 'requestName',
        Cell: ({ row, value }: any) => {
          return (
            <Link
              to={`/governance-review-team/${row.original.id}/intake-request`}
            >
              {value}
            </Link>
          );
        }
      },
      {
        Header: t('intake:fields.component'),
        accessor: 'requester.component'
      },
      {
        Header: t('requestRepository.table.requestType'),
        accessor: 'requestType'
      },
      {
        Header: t('intake:fields.status'),
        accessor: 'status'
      }
    ],
    [t]
  );

  const data = useMemo(() => {
    const tableData = {
      open: openIntakes,
      closed: closedIntakes
    };
    return tableData[activeTable].map(intake => {
      const statusEnum = intake.status;
      let statusTranslation = '';

      // Translating status
      if (statusEnum === 'LCID_ISSUED') {
        // if status is LCID_ISSUED, translate from enum to i18n and append LCID
        statusTranslation = t(`intake:statusMap.${statusEnum}`) + intake.lcid;
      } else {
        // if not just translate from enum to i18n
        statusTranslation = t(`intake:statusMap.${statusEnum}`);
      }

      // Override all applicable fields in intake to use i18n translations
      return {
        ...intake,
        status: statusTranslation,
        requestType: t(`intake:requestTypeMap.${intake.requestType}`)
      };
    });
  }, [activeTable, closedIntakes, openIntakes, t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [{ id: 'submittedAt', desc: true }]
      }
    },
    useSortBy
  );

  const getHeaderSortIcon = (isDesc: boolean | undefined) => {
    return classnames('margin-left-1', {
      'fa fa-caret-down': isDesc,
      'fa fa-caret-up': !isDesc
    });
  };

  const getColumnSortStatus = (
    column: any
  ): 'descending' | 'ascending' | 'none' => {
    if (column.isSorted) {
      if (column.isSortedDesc) {
        return 'descending';
      }
      return 'ascending';
    }

    return 'none';
  };

  const csvHeaders = csvHeaderMap(t);

  const convertIntakesToCSV = (intakes: any[]) => {
    return intakes.map(intake => convertIntakeToCSV(intake));
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <>
      <div className="display-flex flex-justify flex-wrap margin-y-2">
        <BreadcrumbNav>
          <li>
            <Link to="/">Home</Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li>Requests</li>
        </BreadcrumbNav>

        <div>
          <CSVLink
            data={convertIntakesToCSV(data)}
            filename="request-repository.csv"
            headers={csvHeaders}
          >
            <i className="fa fa-download" />
          </CSVLink>
          &nbsp;
          <CSVLink
            data={convertIntakesToCSV(data)}
            filename="request-repository.csv"
            headers={csvHeaders}
          >
            Download all requests as excel file
          </CSVLink>
        </div>
      </div>
      <nav aria-label="Request Repository Table Navigation">
        <ul className="easi-request-repo__tab-list">
          <li
            className={classnames('easi-request-repo__tab', {
              'easi-request-repo__tab--active': activeTable === 'open'
            })}
          >
            <button
              type="button"
              className="easi-request-repo__tab-btn"
              onClick={() => setActiveTable('open')}
            >
              Open Requests
            </button>
          </li>
          <li
            className={classnames('easi-request-repo__tab', {
              'easi-request-repo__tab--active': activeTable === 'closed'
            })}
          >
            <button
              type="button"
              className="easi-request-repo__tab-btn"
              onClick={() => setActiveTable('closed')}
              data-testid="view-closed-intakes-btn"
            >
              Closed Requests
            </button>
          </li>
        </ul>
      </nav>
      <h1 className="font-heading-sm">
        {t('requestRepository.requestCount', {
          context: activeTable,
          count: data.length
        })}
      </h1>
      <Table bordered={false} {...getTableProps()} fullWidth>
        <caption className="usa-sr-only">
          {t('requestRepository.aria.openRequestsTable')}
        </caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {column.render('Header')}
                  {column.isSorted && (
                    <span className={getHeaderSortIcon(column.isSortedDesc)} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th {...cell.getCellProps()} scope="row">
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default RequestRepository;
