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
  ButtonGroup,
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
import { GetTrbAdminTeamHome } from 'queries/types/GetTrbAdminTeamHome';
import { TrbAdminTeamHomeRequest } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

function getPersonVal(name: string, component?: any) {
  return `${name}${typeof component === 'string' ? `, ${component}` : ''}`;
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

export function getTrbRequestDataAsCsv(requests: TrbAdminTeamHomeRequest[]) {
  const rows = requests.map(r => {
    const submissionDate = r.form.submittedAt
      ? formatDateLocal(r.form.submittedAt, 'MM/dd/yyyy')
      : '';
    const trbConsultDate = r.consultMeetingTime
      ? formatDateLocal(r.consultMeetingTime, 'MM/dd/yyyy')
      : '';
    const requester = getPersonVal(
      r.requesterInfo.commonName,
      r.requesterComponent
    );
    const trbLead = getPersonVal(r.trbLeadInfo.commonName, r.trbLeadComponent);

    return [
      submissionDate,
      r.name,
      requester,
      i18next.t<string>(`technicalAssistance:table.requestTypes.${r.type}`),
      trbLead,
      i18next.t<string>(`technicalAssistance:table.requestStatus.${r.status}`),
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

function SubmissionDateCell({
  value
}: CellProps<
  TrbAdminTeamHomeRequest,
  TrbAdminTeamHomeRequest['form']['submittedAt']
>) {
  return value ? formatDateLocal(value, 'MM/dd/yyyy') : '';
}

function RequestNameCell({
  value,
  row
}: CellProps<TrbAdminTeamHomeRequest, TrbAdminTeamHomeRequest['name']>) {
  return (
    <UswdsReactLink to={`/trb/${row.original.id}/request`}>
      {value}
    </UswdsReactLink>
  );
}

function RequesterCell({ row }: CellProps<TrbAdminTeamHomeRequest>) {
  return getPersonVal(
    row.original.requesterInfo.commonName,
    row.original.requesterComponent
  );
}

function TrbLeadCell({ row }: CellProps<TrbAdminTeamHomeRequest>) {
  return getPersonVal(
    row.original.trbLeadInfo.commonName,
    row.original.trbLeadComponent
  );
}

type TrbRequestsTableProps = {
  requests: TrbAdminTeamHomeRequest[];
};

function TrbNewRequestsTable({ requests }: TrbRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  // @ts-ignore
  const columns = useMemo<Column<TrbAdminTeamHomeRequest>[]>(() => {
    return [
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'form.submittedAt',
        Cell: SubmissionDateCell
      },
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name',
        Cell: RequestNameCell
      },
      {
        Header: t<string>('adminHome.requester'),
        accessor: 'requesterInfo.commonName',
        Cell: RequesterCell
      },
      {
        Header: t<string>('adminHome.requestType'),
        accessor: ({ type }) => t(`table.requestTypes.${type}`)
      },
      {
        Header: t<string>('documents.table.header.actions'),
        Cell: ({ value, row }: CellProps<TrbAdminTeamHomeRequest>) => {
          return (
            <>
              <UswdsReactLink
                to={`/trb/${row.original.id}/initial-request-form`}
                className="margin-right-2"
              >
                {t('adminTeamHome.actions.reviewRequest')}
              </UswdsReactLink>
              {/* wip assign lead could be a modal popup */}
              <Button type="button" unstyled>
                {t('adminTeamHome.actions.assignLead')}
              </Button>
            </>
          );
        },
        disableSortBy: true
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

      {/* Download new requests csv */}
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
                  {column.canSort ? (
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
                  ) : (
                    <div className="text-normal text-no-wrap">
                      {column.render('Header')}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIdx) => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="bg-transparent"
                      data-testid={`trb-new-cell-${rowIdx}-${index}`}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length === 0 && (
        <div className="padding-x-2 padding-bottom-1 border-bottom-1px margin-top-neg-105 line-height-body-5">
          {t('adminTeamHome.newRequests.noRequests')}
        </div>
      )}

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
    </div>
  );
}

function TrbExistingRequestsTable({ requests }: TrbRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  const [activeTable, setActiveTable] = useState<'open' | 'closed'>('open');

  // @ts-ignore
  const columns = useMemo<Column<TrbAdminTeamHomeRequest>[]>(() => {
    return [
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'form.submittedAt',
        Cell: SubmissionDateCell
      },
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name',
        Cell: RequestNameCell
      },
      {
        Header: t<string>('adminHome.requester'),
        accessor: 'requesterInfo.commonName',
        Cell: RequesterCell
      },
      {
        Header: t<string>('adminHome.trbLead'),
        accessor: 'trbLeadInfo.commonName',
        Cell: TrbLeadCell
      },
      {
        Header: t<string>('adminHome.status'),
        accessor: ({ status }) => t(`table.requestStatus.${status}`)
      },
      {
        Header: t<string>('table.header.trbConsultDate'),
        accessor: 'consultMeetingTime',
        Cell: ({
          value,
          row
        }: CellProps<
          TrbAdminTeamHomeRequest,
          TrbAdminTeamHomeRequest['consultMeetingTime']
        >) =>
          value ? (
            formatDateLocal(value, 'MM/dd/yyyy')
          ) : (
            <UswdsReactLink
              to={`/trb/${row.original.id}/initial-request-form/schedule-consult`}
            >
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
          // Switch on open vs closed existing requests
          requests.filter((d: any) => d.state.toLowerCase() === activeTable),
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

      {/* Download existing requests csv */}
      <div className="margin-bottom-4 line-height-body-5">
        <CsvDownloadLink
          data={getTrbRequestDataAsCsv(requests)}
          filename="existing-trb-requests.csv"
        >
          {t('adminTeamHome.existingRequests.downloadCsv')}
        </CsvDownloadLink>
      </div>

      {/* Open | Closed requests tabs */}
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
        className="margin-bottom-5 maxw-mobile-lg"
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
          {page.map((row, rowIdx) => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      data-testid={`trb-existing-cell-${rowIdx}-${index}`}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length === 0 && (
        <div className="padding-x-2 padding-bottom-1 border-bottom-1px margin-top-neg-105 line-height-body-5">
          {t(`adminTeamHome.existingRequests.noRequests.${activeTable}`)}
        </div>
      )}

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
    </div>
  );
}

function TrbAdminTeamHome() {
  const { t } = useTranslation('technicalAssistance');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, data } = useQuery<GetTrbAdminTeamHome>(
    GetTrbAdminTeamHomeQuery
  );

  // todo Refer to EASI-2725 on when backend will handle this filtering
  const trbRequests = data?.trbRequests.filter(
    r => r.form.submittedAt !== null
  );

  return (
    <GridContainer className="width-full">
      <PageHeading className="margin-bottom-1">{t('heading')}</PageHeading>
      <div className="font-body-lg line-height-body-5 text-light">
        {t('adminTeamHome.description')}
      </div>
      {loading && <PageLoading />}
      {Array.isArray(trbRequests) && (
        <>
          <ButtonGroup className="trb-admin-team-home-actions margin-top-1 line-height-body-5">
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
              {t('adminTeamHome.jumpToExistingRequests')}
            </Button>
            <CsvDownloadLink
              data={getTrbRequestDataAsCsv(trbRequests)}
              filename="all-trb-requests.csv"
            >
              {t('adminTeamHome.downloadAllTrbRequests')}
            </CsvDownloadLink>
            {/* {t('adminTeamHome.switchToDifferentAdminView')} post-mvp */}
            <UswdsReactLink to="/trb/start">
              {t('adminTeamHome.submitYourOwnRequest')}
            </UswdsReactLink>
          </ButtonGroup>
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

export default TrbAdminTeamHome;
