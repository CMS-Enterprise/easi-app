import React, { useContext, useMemo, useRef, useState } from 'react';
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
import {
  Button,
  ButtonGroup,
  GridContainer,
  ModalRef,
  Table
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import NotFound from 'features/Miscellaneous/NotFound';
import {
  GetTRBAdminHomeQuery,
  TRBRequestState,
  useGetTRBAdminHomeQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { ActiveStateType, TableStateContext } from 'wrappers/TableStateWrapper';

import CsvDownloadLink from 'components/CsvDownloadLink';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import useTableState from 'hooks/useTableState';
import { TrbRequestIdRef } from 'types/technicalAssistance';
import { cleanCSVData } from 'utils/csv';
import { formatDateLocal } from 'utils/date';
import formatContractNumbers from 'utils/formatContractNumbers';
import { getPersonNameAndComponentVal } from 'utils/getPersonNameAndComponent';
import globalFilterCellText from 'utils/globalFilterCellText';
import { trbRequestStatusSortType } from 'utils/tableRequestStatusIndex';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

import TrbAssignLeadModal, {
  TrbAssignLeadModalOpener
} from '../_components/TrbAssignLeadModal';

type TrbAdminTeamHomeRequest = GetTRBAdminHomeQuery['trbRequests'][number];

export const trbRequestsCsvHeader = [
  i18next.t<string>('technicalAssistance:table.header.submissionDate'),
  i18next.t<string>('technicalAssistance:table.header.requestName'),
  i18next.t<string>('technicalAssistance:adminHome.requester'),
  i18next.t<string>('technicalAssistance:adminHome.requestType'),
  i18next.t<string>('technicalAssistance:adminHome.trbLead'),
  i18next.t<string>('technicalAssistance:adminHome.status'),
  i18next.t<string>('technicalAssistance:table.header.trbConsultDate'),
  i18next.t<string>('intake:csvHeadings.contractName'),
  i18next.t<string>('intake:csvHeadings.contractNumber'),
  i18next.t<string>('intake:csvHeadings.cmsSystem')
] as const;

export function getTrbRequestDataAsCsv(requests: TrbAdminTeamHomeRequest[]) {
  const rows = requests.map(r => {
    const submissionDate = r.form.submittedAt
      ? formatDateLocal(r.form.submittedAt, 'MM/dd/yyyy')
      : '';
    const trbConsultDate = r.consultMeetingTime
      ? formatDateLocal(r.consultMeetingTime, 'MM/dd/yyyy')
      : '';
    const requester = getPersonNameAndComponentVal(
      r.requesterInfo.commonName,
      r.requesterComponent
    );
    const trbLead = getPersonNameAndComponentVal(
      r.trbLeadInfo.commonName,
      'TRB'
    );
    const contractNumber = formatContractNumbers(r.contractNumbers);
    const cmsSystem = r.systems.map(v => v.name).join(', ');

    return [
      submissionDate,
      r.name,
      requester,
      i18next.t<string>(`technicalAssistance:table.requestTypes.${r.type}`),
      trbLead,
      i18next.t<string>(`technicalAssistance:table.requestStatus.${r.status}`),
      trbConsultDate,
      r.contractName || '',
      contractNumber,
      cmsSystem
    ];
  });

  const cleanedRows = cleanCSVData(rows);

  return [trbRequestsCsvHeader, ...cleanedRows];
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
      {value || i18next.t<string>('technicalAssistance:taskList.defaultName')}
    </UswdsReactLink>
  );
}

function RequesterCell({ row }: CellProps<TrbAdminTeamHomeRequest>) {
  return getPersonNameAndComponentVal(
    row.original.requesterInfo.commonName,
    row.original.requesterComponent
  );
}

function TrbLeadCell({ row }: CellProps<TrbAdminTeamHomeRequest>) {
  return getPersonNameAndComponentVal(
    row.original.trbLeadInfo.commonName,
    'TRB'
  );
}

type TrbRequestsTableProps = {
  requests: TrbAdminTeamHomeRequest[];
  className?: string;
};

function TrbNewRequestsTable({ requests, className }: TrbRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  // Assign trb lead modal refs
  const assignLeadModalRef = useRef<ModalRef>(null);
  const assignLeadModalTrbRequestIdRef = useRef<TrbRequestIdRef>(null);

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
        Header: t<string>('documents.table.header.trbLead'),
        Cell: ({ row }: CellProps<TrbAdminTeamHomeRequest>) => (
          <>
            {row.original.trbLeadInfo.commonName && (
              <p>{row.original.trbLeadInfo.commonName}</p>
            )}
            <TrbAssignLeadModalOpener
              trbRequestId={row.original.id}
              modalRef={assignLeadModalRef}
              trbRequestIdRef={assignLeadModalTrbRequestIdRef}
              className="usa-button--unstyled"
            >
              {row.original.trbLeadInfo.commonName === ''
                ? t('adminTeamHome.actions.assignLead')
                : t('adminTeamHome.actions.changeLead')}
            </TrbAssignLeadModalOpener>
          </>
        ),
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
      autoResetPage: true,
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
    <div className={classnames('bg-accent-cool-lighter padding-4', className)}>
      <h3 className="margin-top-0 margin-bottom-1">
        {t('adminTeamHome.newRequests.heading')}
      </h3>
      <p className="margin-y-1 line-height-body-5">
        {t('adminTeamHome.newRequests.description')}
      </p>

      {/* Download new requests csv */}
      <CsvDownloadLink
        data={getTrbRequestDataAsCsv(requests)}
        filename="new-trb-requests.csv"
        className="display-inline-block margin-bottom-1 line-height-body-5"
      >
        {t('adminTeamHome.newRequests.downloadCsv')}
      </CsvDownloadLink>

      <Table bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={{ ...headerGroup.getHeaderGroupProps() }.key}
            >
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px bg-transparent"
                >
                  {column.canSort ? (
                    <Button
                      type="button"
                      unstyled
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      {getHeaderSortIcon(column)}
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
              <tr {...row.getRowProps()} key={{ ...row.getRowProps() }.key}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={{ ...cell.getCellProps() }.key}
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

      <TrbAssignLeadModal
        modalRef={assignLeadModalRef}
        trbRequestIdRef={assignLeadModalTrbRequestIdRef}
      />
    </div>
  );
}

function TrbExistingRequestsTable({ requests }: TrbRequestsTableProps) {
  const { t } = useTranslation('technicalAssistance');

  const { trbExistingRequests } = useContext(TableStateContext);
  const [activeTable, setActiveTable] = useState<ActiveStateType>(
    trbExistingRequests.current.activeTableState
  );

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
        accessor: ({ status, state }) =>
          state === TRBRequestState.CLOSED
            ? t(`table.requestState.${state}`)
            : t(`table.requestStatus.${status}`),
        sortType: trbRequestStatusSortType
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
          ),
        sortType: (a, b) => {
          // The consult date property can be null if not set
          // Allow actual null types to be compared against so that they move towards the end of a sort

          if (a.values.consultMeetingTime === null) {
            // Fallback sort on submitted date if consult is not set
            if (b.values.consultMeetingTime === null) {
              return a.values['form.submittedAt'] > b.values['form.submittedAt']
                ? 1
                : -1;
            }
            // Move null consult dates ahead of defined
            return 1;
          }

          return a.values.consultMeetingTime > b.values.consultMeetingTime
            ? 1
            : -1;
        }
      }
    ];
  }, [t]);

  const data = useMemo(
    () =>
      // Switch on open vs closed existing requests
      requests.filter((d: any) => d.state.toLowerCase() === activeTable),
    [activeTable, requests]
  );

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
    state,
    setSortBy
  } = useTable(
    {
      columns,
      globalFilter: useMemo(() => globalFilterCellText, []),
      data,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'consultMeetingTime', desc: true }], []),
        pageIndex: trbExistingRequests.current.state.pageIndex,
        pageSize: window.localStorage['request-table-page-size']
          ? Number(window.localStorage['request-table-page-size'])
          : 10
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  // Sets persisted table state and stores state on unmount
  useTableState(
    'trbExistingRequests',
    state,
    gotoPage,
    setSortBy,
    setGlobalFilter,
    activeTable,
    data
  );

  return (
    <div>
      <h3 className="margin-top-0 margin-bottom-1">
        {t('adminTeamHome.existingRequests.heading')}
      </h3>
      <p className="margin-y-1 line-height-body-5">
        {t('adminTeamHome.existingRequests.description')}
      </p>

      {/* Download existing requests csv */}
      <CsvDownloadLink
        data={getTrbRequestDataAsCsv(requests)}
        filename="existing-trb-requests.csv"
        className="display-inline-block margin-bottom-2 line-height-body-5"
      >
        {t('adminTeamHome.existingRequests.downloadCsv')}
      </CsvDownloadLink>

      {/* Open | Closed requests tabs */}
      <nav aria-label={t('adminTeamHome.existingRequests.tabs.label')}>
        <ul className="easi-request-repo__tab-list margin-bottom-4">
          <li
            className={classnames('easi-request-repo__tab font-body-2xs', {
              'easi-request-repo__tab--active': activeTable === 'open'
            })}
          >
            <button
              type="button"
              className={`easi-request-repo__tab-btn line-height-body-3 text-${
                activeTable === 'open' ? 'primary' : 'base-dark'
              }`}
              onClick={() => {
                setActiveTable('open');
                gotoPage(0);
              }}
            >
              {t('adminTeamHome.existingRequests.tabs.open.name')}
            </button>
          </li>
          <li
            className={classnames('easi-request-repo__tab font-body-2xs', {
              'easi-request-repo__tab--active': activeTable === 'closed'
            })}
          >
            <button
              type="button"
              className={`easi-request-repo__tab-btn line-height-body-3 text-${
                activeTable === 'closed' ? 'primary' : 'base-dark'
              }`}
              onClick={() => {
                setActiveTable('closed');
                gotoPage(0);
              }}
            >
              {t('adminTeamHome.existingRequests.tabs.closed.name')}
            </button>
          </li>
        </ul>
      </nav>

      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        initialFilter={trbExistingRequests.current.state.globalFilter}
        tableID={t('adminTeamHome.existingRequests.id')}
        tableName={t('adminTeamHome.existingRequests.heading')}
        className="margin-bottom-5 maxw-mobile-lg"
      />

      <Table bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={{ ...headerGroup.getHeaderGroupProps() }.key}
            >
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px"
                >
                  <Button
                    type="button"
                    unstyled
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column)}
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
                      {...cell.getCellProps()}
                      key={{ ...cell.getCellProps() }.key}
                      data-testid={`trb-existing-cell-${rowIdx}-${index}`}
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

  const { loading, error, data } = useGetTRBAdminHomeQuery();

  if (error) {
    return <NotFound />;
  }

  // todo Refer to EASI-2725 on when backend will handle this filtering
  const trbRequests = data?.trbRequests.filter(
    r => r.form.submittedAt !== null
  );

  return (
    <GridContainer className="width-full margin-bottom-5 desktop:margin-bottom-10">
      {loading && <PageLoading />}
      {Array.isArray(trbRequests) && (
        <>
          <ButtonGroup className="trb-admin-team-home-actions margin-y-2 line-height-body-5">
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
          <TrbNewRequestsTable
            requests={trbRequests.filter(d => d.isRecent)}
            className="margin-bottom-2"
          />
          <TrbExistingRequestsTable requests={trbRequests} />
        </>
      )}
    </GridContainer>
  );
}

export default TrbAdminTeamHome;
