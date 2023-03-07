import React, { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import {
  CellProps,
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import {
  Button,
  GridContainer,
  IconFileDownload,
  Table
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
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
import { formatDateLocal } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

function SubmissionDateCell({
  value
}: CellProps<TrbRequests, TrbRequests['form']['submittedAt']>) {
  const { t } = useTranslation('technicalAssistance');
  return value
    ? formatDateLocal(value, 'MM/dd/yyyy')
    : t('check.notYetSubmitted');
}

function NameCell({ value, row }: CellProps<TrbRequests, TrbRequests['name']>) {
  return (
    <UswdsReactLink to={`/trb/${row.original.id}`}>{value}</UswdsReactLink>
  );
}
export const trbRequestsCsvHeader = [
  i18next.t<string>('technicalAssistance:table.header.submissionDate'),
  i18next.t<string>('technicalAssistance:table.header.requestName'),
  i18next.t<string>('technicalAssistance:adminHome.requester'),
  i18next.t<string>('technicalAssistance:adminHome.requestType'),
  i18next.t<string>('technicalAssistance:adminHome.trbLead'),
  i18next.t<string>('technicalAssistance:adminHome.status'),
  i18next.t<string>('technicalAssistance:table.header.trbConsultDate')
] as const;

export function getTrbRequestDataAsCsv(requests: TrbRequests[]) {
  const rows = requests.map(r => {
    const submissionDate = r.form.submittedAt
      ? formatDateLocal(r.form.submittedAt, 'MM/dd/yyyy')
      : '';
    const trbConsultDate = r.consultMeetingTime
      ? formatDateLocal(r.consultMeetingTime, 'MM/dd/yyyy')
      : '';

    return [
      submissionDate,
      r.name,
      'requester wip',
      i18next.t<string>(`technicalAssistance:table.requestTypes.${r.type}`),
      'trb lead wip',
      r.status,
      trbConsultDate
    ];
  });

  return [trbRequestsCsvHeader, ...rows];
}

function CsvDownloadLink({
  children,
  data,
  filename
}: {
  children?: React.ReactNode;
  data: any;
  filename?: string;
}) {
  return (
    <CSVLink className="usa-link" data={data} filename={filename}>
      <IconFileDownload className="text-middle margin-right-1" />
      {children}
    </CSVLink>
  );
}

type TrbRequestsTableProps = {
  requests: TrbRequests[];
};

function TrbNewRequestsTable({ requests }: TrbRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  // @ts-ignore
  const columns = useMemo<Column<TrbRequests>[]>(() => {
    return [
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'form.submittedAt',
        Cell: SubmissionDateCell
      },
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name',
        Cell: NameCell
      },
      {
        Header: t<string>('adminHome.requester')
      },
      {
        Header: t<string>('adminHome.requestType'),
        accessor: ({ type }) => t(`table.requestTypes.${type}`)
      },
      {
        Header: t<string>('documents.table.header.actions'),
        Cell: ({ value, row }: CellProps<TrbRequests>) => {
          return (
            <>
              <UswdsReactLink
                to={`/trb/${row.original.id}`}
                className="margin-right-2"
              >
                {t('adminTeamHome.actions.reviewRequest')}
              </UswdsReactLink>
              <UswdsReactLink to={`/trb/${row.original.id}`}>
                {t('adminTeamHome.actions.assignLead')}
              </UswdsReactLink>
            </>
          );
        }
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
    <div className="bg-accent-cool-lighter padding-4">
      <h3 className="margin-top-0 margin-bottom-1">
        {t('adminTeamHome.newRequests.heading')}
      </h3>
      <div className="margin-bottom-1 line-height-body-5">
        {t('adminTeamHome.newRequests.description')}
      </div>

      <div className="margin-bottom-4 line-height-body-5">
        <CsvDownloadLink
          data={getTrbRequestDataAsCsv(requests)}
          filename="new-trb-requests.csv"
        >
          {t('adminTeamHome.newRequests.downloadCsv')}
        </CsvDownloadLink>
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
                  className="border-bottom-2px bg-transparent"
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
                    <td {...cell.getCellProps()} className="bg-transparent">
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
              transparentBg
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
      {rows.length === 0 && (
        <div className="padding-x-2 padding-bottom-1 border-bottom-1px">
          {t('adminTeamHome.newRequests.noRequests')}
        </div>
      )}
    </div>
  );
}

function TrbExistingRequestsTable({ requests }: TrbRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  const [activeTable, setActiveTable] = useState<'open' | 'closed'>('open');

  // @ts-ignore
  const columns = useMemo<Column<TrbRequests>[]>(() => {
    return [
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'form.submittedAt',
        Cell: SubmissionDateCell
      },
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name',
        Cell: NameCell
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
        accessor: 'consultMeetingTime',
        Cell: ({
          value,
          row
        }: CellProps<TrbRequests, TrbRequests['consultMeetingTime']>) =>
          value ? (
            formatDateLocal(value, 'MM/dd/yyyy')
          ) : (
            <UswdsReactLink to={`/trb/${row.original.id}`}>
              {t('adminTeamHome.actions.addDate')}
            </UswdsReactLink>
          )
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
      data: useMemo(
        () =>
          requests.filter((d: any) => d.status.toLowerCase() === activeTable),
        [activeTable, requests]
      ),
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
      <h3 className="margin-top-0 margin-bottom-1">
        {t('adminTeamHome.existingRequests.heading')}
      </h3>
      <div className="margin-bottom-1 line-height-body-5">
        {t('adminTeamHome.existingRequests.description')}
      </div>

      <div className="margin-bottom-4 line-height-body-5">
        <CsvDownloadLink
          data={getTrbRequestDataAsCsv(requests)}
          filename="existing-trb-requests.csv"
        >
          {t('adminTeamHome.existingRequests.downloadCsv')}
        </CsvDownloadLink>
      </div>

      <nav aria-label={t('adminTeamHome.existingRequests.tabs.label')}>
        <ul className="easi-request-repo__tab-list margin-bottom-4">
          <li
            className={classnames('easi-request-repo__tab', {
              'easi-request-repo__tab--active': activeTable === 'open'
            })}
          >
            <button
              type="button"
              className="easi-request-repo__tab-btn"
              onClick={() => setActiveTable('open')}
              aria-label={
                activeTable === 'open'
                  ? t('adminTeamHome.existingRequests.tabs.selected', {
                      name: t('adminTeamHome.existingRequests.tabs.open.name')
                    })
                  : ''
              }
            >
              {t('adminTeamHome.existingRequests.tabs.open.name')}
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
              aria-label={
                activeTable === 'closed'
                  ? t('adminTeamHome.existingRequests.tabs.selected', {
                      name: t('adminTeamHome.existingRequests.tabs.closed.name')
                    })
                  : ''
              }
            >
              {t('adminTeamHome.existingRequests.tabs.closed.name')}
            </button>
          </li>
        </ul>
      </nav>

      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('systemTable.id')}
        tableName={t('systemTable.title')}
        className="margin-bottom-5"
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
                  className="border-bottom-2px"
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
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
      {rows.length === 0 && (
        <div className="padding-x-2 padding-bottom-1 border-bottom-1px">
          {t(`adminTeamHome.existingRequests.noRequests.${activeTable}`)}
        </div>
      )}
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
      <PageHeading className="margin-bottom-1">{t('heading')}</PageHeading>
      <div className="font-body-lg">{t('adminTeamHome.description')}</div>
      {loading && <PageLoading />}
      {Array.isArray(trbRequests) && (
        <>
          <ul className="usa-list--unstyled trb-action-options margin-top-1 line-height-body-5">
            <li>
              <Button
                type="button"
                unstyled
                className="usa-link"
                onClick={() => {
                  document
                    .querySelector('.trb-existing-requests-table')
                    ?.scrollIntoView();
                }}
              >
                {t('adminTeamHome.jumpToExitingRequests')}
              </Button>
            </li>
            <li>
              <CsvDownloadLink
                data={getTrbRequestDataAsCsv(trbRequests)}
                filename="all-trb-requests.csv"
              >
                {t('adminTeamHome.downloadAllTrbRequests')}
              </CsvDownloadLink>
            </li>
            {/* <li>{t('adminTeamHome.switchToDifferentAdminView')}</li> post-mvp */}
            <li>
              <UswdsReactLink to="/trb/start">
                {t('adminTeamHome.submitYourOwnRequest')}
              </UswdsReactLink>
            </li>
          </ul>
          <div className="margin-top-6">
            <TrbNewRequestsTable
              requests={trbRequests.filter(d => d.isRecent)}
            />
          </div>
          <div className="margin-top-6 trb-existing-requests-table">
            <TrbExistingRequestsTable
              requests={trbRequests.filter(d => !d.isRecent)}
            />
          </div>
        </>
      )}
    </GridContainer>
  );
}

export default TeamHome;
