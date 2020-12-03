import React, { useEffect, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Link as UswdsLink, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import { convertIntakeToCSV } from 'data/systemIntake';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

import csvHeaderMap from './csvHeaderMap';

const RequestRepository = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const dispatch = useDispatch();

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
        Header: t('intake:fields.grtDate'),
        accessor: 'grtDate',
        Cell: ({ row, value }: any) => {
          if (value) {
            return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
          }

          // If date is null, return button that takes user to page to add date
          return (
            <UswdsLink
              data-testid="add-grt-date-cta"
              asCustom={Link}
              to={`/governance-review-team/${row.original.id}/dates`}
            >
              {t('requestRepository.table.addDate')}
            </UswdsLink>
          );
        }
      },
      {
        Header: t('intake:fields.grbDate'),
        accessor: 'grbDate',
        Cell: ({ row, value }: any) => {
          if (value) {
            return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
          }

          // If date is null, return button that takes user to page to add date
          return (
            <UswdsLink
              data-testid="add-grb-date-cta"
              asCustom={Link}
              to={`/governance-review-team/${row.original.id}/dates`}
            >
              {t('requestRepository.table.addDate')}
            </UswdsLink>
          );
        }
      },
      {
        Header: t('intake:fields.status'),
        accessor: 'status'
      }
    ],
    [t]
  );

  useEffect(() => {
    dispatch(fetchSystemIntakes({ status: 'open' }));
  }, [dispatch]);

  const systemIntakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );

  const data = useMemo(() => {
    return systemIntakes.map(intake => {
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
  }, [systemIntakes, t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      sortTypes: {
        // TODO: This may not work if another column is added that is not a string or date.
        // Sort method changes depending on if item is a string or object
        alphanumeric: (row1, row2, columnName) => {
          const rowOne = row1.values[columnName];
          const rowTwo = row2.values[columnName];

          // If item is a string, enforce capitalization (temporarily) and then compare
          if (typeof rowOne === 'string') {
            return rowOne.toUpperCase() > rowTwo.toUpperCase() ? 1 : -1;
          }

          // If item is a DateTime, convert to Number and compare
          if (rowOne instanceof DateTime) {
            return Number(rowOne) > Number(rowTwo) ? 1 : -1;
          }

          // If neither string nor DateTime, return bare comparison
          return rowOne > rowTwo ? 1 : -1;
        }
      },
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

  const convertIntakesToCSV = (intakes: SystemIntakeForm[]) => {
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
      <h1>{t('requestRepository.header')}</h1>
      <p>{t('requestRepository.requestCount', { count: data.length })}</p>
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
