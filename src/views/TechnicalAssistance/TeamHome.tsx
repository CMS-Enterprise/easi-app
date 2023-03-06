import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { Button, GridContainer, Table } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import GetTrbAdminTeamHomeQuery from 'queries/GetTrbAdminTeamHomeQuery';
import {
  GetTrbAdminTeamHome,
  GetTrbAdminTeamHome_trbRequests as TrbRequests
} from 'queries/types/GetTrbAdminTeamHome';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

type TrbNewRequestsTableProps = {
  requests: any;
};

function TrbNewRequestsTable({ requests }: TrbNewRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  // @ts-ignore
  const columns = useMemo<Column<TrbRequests>[]>(() => {
    return [
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'form.submittedAt'
      },
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name'
      },
      {
        Header: t<string>('adminHome.requester')
      },
      {
        Header: t<string>('adminHome.requestType'),
        accessor: 'type'
      },
      {
        Header: t<string>('documents.table.header.actions')
      }
    ];
  }, [t]);

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    rows,
    setPageSize,
    state
  } = useTable(
    {
      columns,
      globalFilter: useMemo(() => globalFilterCellText, []),
      data: requests,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'form.submittedAt', desc: true }], []),
        pageIndex: 0,
        pageSize: 5
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  return (
    <div className="bg-accent-cool-lighter">
      <h3>{t('adminTeamHome.newRequests.heading')}</h3>
      <div>{t('adminTeamHome.newRequests.description')}</div>

      <div>
        <Button type="button" unstyled>
          {t('adminTeamHome.newRequests.downloadCsv')}
        </Button>
      </div>

      <Table bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px padding-left-0"
                >
                  <Button
                    type="button"
                    unstyled
                    className="width-full display-flex"
                    {...column.getSortByToggleProps()}
                  >
                    <div className="flex-fill text-no-wrap">
                      {column.render('Header')}
                    </div>
                    <div className="position-relative width-205 margin-left-05">
                      {getHeaderSortIcon(column)}
                    </div>
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td {...cell.getCellProps()} className="padding-left-0">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length > 0 && (
        <>
          <div className="grid-row grid-gap grid-gap-lg">
            <TablePagination
              gotoPage={gotoPage}
              previousPage={previousPage}
              nextPage={nextPage}
              canNextPage={canNextPage}
              pageIndex={state.pageIndex}
              pageOptions={pageOptions}
              canPreviousPage={canPreviousPage}
              pageCount={pageCount}
              pageSize={state.pageSize}
              setPageSize={setPageSize}
              page={[]}
              className="desktop:grid-col-fill desktop:padding-bottom-0 desktop:margin-bottom-0"
            />
          </div>

          <div
            className="usa-sr-only usa-table__announcement-region"
            aria-live="polite"
          >
            {currentTableSortDescription(headerGroups[0])}
          </div>
        </>
      )}
      {rows.length === 0 && t('adminTeamHome.newRequests.noRequests')}
    </div>
  );
}

type TrbExistingRequestsTableProps = {
  requests: any;
};

function TrbExistingRequestsTable({ requests }: TrbExistingRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTable, setActiveTable] = useState<'open' | 'closed'>('open');

  // @ts-ignore
  const columns = useMemo<Column<TrbRequests>[]>(() => {
    return [
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'form.submittedAt'
      },
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name'
      },
      {
        Header: t<string>('adminHome.requester')
      },
      {
        Header: t<string>('adminHome.trbLead'),
        accessor: 'trbLead'
      },
      {
        Header: t<string>('adminHome.status'),
        accessor: 'status'
      },
      {
        Header: t<string>('table.header.trbConsultDate'),
        accessor: 'consultMeetingTime'
      }
    ];
  }, [t]);

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    rows,
    setGlobalFilter,
    setPageSize,
    state
  } = useTable(
    {
      columns,
      globalFilter: useMemo(() => globalFilterCellText, []),
      data: requests,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'form.submittedAt', desc: true }], []),
        pageIndex: 0,
        pageSize: 10
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  return (
    <div>
      <h3>{t('adminTeamHome.existingRequests.heading')}</h3>
      <div>{t('adminTeamHome.existingRequests.description')}</div>

      <div>
        <Button type="button" unstyled>
          {t('adminTeamHome.existingRequests.downloadCsv')}
        </Button>
      </div>

      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('systemTable.id')}
        tableName={t('systemTable.title')}
        className="margin-bottom-4"
      />

      <Table bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px padding-left-0"
                >
                  <Button
                    type="button"
                    unstyled
                    className="width-full display-flex"
                    {...column.getSortByToggleProps()}
                  >
                    <div className="flex-fill text-no-wrap">
                      {column.render('Header')}
                    </div>
                    <div className="position-relative width-205 margin-left-05">
                      {getHeaderSortIcon(column)}
                    </div>
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td {...cell.getCellProps()} className="padding-left-0">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length > 0 && (
        <>
          <div className="grid-row grid-gap grid-gap-lg">
            <TablePagination
              gotoPage={gotoPage}
              previousPage={previousPage}
              nextPage={nextPage}
              canNextPage={canNextPage}
              pageIndex={state.pageIndex}
              pageOptions={pageOptions}
              canPreviousPage={canPreviousPage}
              pageCount={pageCount}
              pageSize={state.pageSize}
              setPageSize={setPageSize}
              page={[]}
              className="desktop:grid-col-fill desktop:padding-bottom-0 desktop:margin-bottom-0"
            />
            <TablePageSize
              className="desktop:grid-col-auto"
              pageSize={state.pageSize}
              setPageSize={setPageSize}
            />
          </div>

          <div
            className="usa-sr-only usa-table__announcement-region"
            aria-live="polite"
          >
            {currentTableSortDescription(headerGroups[0])}
          </div>
        </>
      )}
      {rows.length === 0 &&
        t(`adminTeamHome.existingRequests.noRequests.${activeTable}`)}
    </div>
  );
}

type TeamHomeProps = {};

// eslint-disable-next-line no-empty-pattern
function TeamHome({}: TeamHomeProps) {
  const { t } = useTranslation('technicalAssistance');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, data } = useQuery<GetTrbAdminTeamHome>(
    GetTrbAdminTeamHomeQuery
  );

  const trbRequests = data?.trbRequests;

  return (
    <GridContainer className="width-full">
      <PageHeading>{t('heading')}</PageHeading>
      <div>{t('adminTeamHome.description')}</div>
      {loading && <PageLoading />}
      <ul>
        <li>{t('adminTeamHome.jumpToExitingRequests')}</li>
        <li>{t('adminTeamHome.downloadAllTrbRequests')}</li>
        <li>
          <Button type="button" unstyled>
            {t('adminTeamHome.switchToDifferentAdminView')}
          </Button>
        </li>
        <li>{t('adminTeamHome.submitYourOwnRequest')}</li>
      </ul>
      {Array.isArray(trbRequests) && (
        <>
          <TrbNewRequestsTable requests={trbRequests.filter(d => d.isRecent)} />
          <TrbExistingRequestsTable
            requests={trbRequests.filter(d => !d.isRecent)}
          />
        </>
      )}
    </GridContainer>
  );
}

export default TeamHome;
