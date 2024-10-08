import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
import { Button, Icon, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import IconLink from 'components/shared/IconLink';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import GetLinkedRequestsQuery from 'queries/GetLinkedRequestsQuery';
import {
  GetLinkedRequests,
  GetLinkedRequestsVariables
} from 'queries/types/GetLinkedRequests';
import { SystemIntakeState, TRBRequestState } from 'types/graphql-global-types';
import { SystemLinkedRequest } from 'types/systemLinkedRequest';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import linkCedarSystemIdQueryString from 'utils/linkCedarSystemIdQueryString';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';
import { NotFoundPartial } from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

const processName = {
  SystemIntake: 'IT Governance',
  TRBRequest: 'TRB'
} as const;

function LinkedRequestsTable({ systemId }: { systemId: string }) {
  const { t } = useTranslation('tableAndPagination');

  const [activeTable, setActiveTable] = useState<'open' | 'closed'>('open');

  const { loading, error, data } = useQuery<
    GetLinkedRequests,
    GetLinkedRequestsVariables
  >(GetLinkedRequestsQuery, {
    variables: {
      cedarSystemId: systemId,
      systemIntakeState:
        activeTable === 'open'
          ? SystemIntakeState.OPEN
          : SystemIntakeState.CLOSED,
      trbRequestState:
        activeTable === 'open' ? TRBRequestState.OPEN : TRBRequestState.CLOSED
    }
  });

  const { linkedSystemIntakes, linkedTrbRequests } =
    data?.cedarSystemDetails?.cedarSystem || {};

  const tableData: SystemLinkedRequest[] = useMemo(
    () =>
      Array.isArray(linkedSystemIntakes) && Array.isArray(linkedTrbRequests)
        ? [...linkedSystemIntakes, ...linkedTrbRequests]
        : [],
    [linkedSystemIntakes, linkedTrbRequests]
  );

  const columns: Column<SystemLinkedRequest>[] = useMemo(() => {
    return [
      {
        Header: t<string>('header.submissionDate'),
        id: 'submittedAt',
        accessor: lr => {
          // eslint-disable-next-line no-underscore-dangle
          if (lr.__typename === 'TRBRequest') {
            return lr.form.submittedAt;
          }
          return lr.submittedAt;
        },
        Cell: ({ value }: CellProps<SystemLinkedRequest, string | null>) => {
          return value
            ? formatDateLocal(value, 'MM/dd/yyyy')
            : t<string>('defaultVal.notSubmitted');
        }
      },
      {
        Header: t<string>('header.requestName'),
        accessor: 'name',
        Cell: ({
          value
        }: CellProps<SystemLinkedRequest, SystemLinkedRequest['name']>) => {
          return value || t<string>('defaultVal.draft');
        }
      },
      {
        Header: t<string>('header.process'),
        accessor: '__typename',
        Cell: ({
          value
        }: CellProps<
          SystemLinkedRequest,
          SystemLinkedRequest['__typename']
        >) => {
          return processName[value];
        }
      },
      {
        Header: t<string>('header.status'),
        accessor: 'status',
        Cell: ({ value, row }: CellProps<SystemLinkedRequest, string>) => {
          const lr = row.original;
          // eslint-disable-next-line no-underscore-dangle
          if (lr.__typename === 'TRBRequest') {
            return lr.state === TRBRequestState.CLOSED
              ? t(`status.requestState.${lr.state}`)
              : t(`status.requestStatus.${value}`);
          }
          return t(
            `governanceReviewTeam:systemIntakeStatusRequester.${value}`,
            { lcid: lr.lcid }
          );
        }
      },
      activeTable === 'open'
        ? {
            Header: t<string>('header.upcomingMeetingDate'),
            accessor: 'nextMeetingDate',
            Cell: ({ value }: CellProps<SystemLinkedRequest, string>) => {
              if (value) {
                return formatDateUtc(value, 'MM/dd/yyyy');
              }
              return t('defaultVal.none');
            }
          }
        : {
            Header: t<string>('header.lastMeetingDate'),
            accessor: 'lastMeetingDate',
            Cell: ({ value }: CellProps<SystemLinkedRequest, string>) => {
              if (value) {
                return formatDateUtc(value, 'MM/dd/yyyy');
              }
              return t('defaultVal.none');
            }
          },
      {
        Header: t<string>('header.requester'),
        accessor: lr => {
          // eslint-disable-next-line no-underscore-dangle
          if (lr.__typename === 'TRBRequest') {
            return lr.requesterInfo.commonName;
          }
          return lr.requesterName;
        }
      }
    ];
  }, [activeTable, t]);

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
      data: tableData,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], []),
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

  if (error) {
    return <NotFoundPartial />;
  }

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div data-testid="system-linked-requests">
      {/* Open | Closed requests tabs */}
      <nav aria-label={t('openClosedRequestsTabs.label')}>
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
              onClick={() => setActiveTable('open')}
            >
              {t('openClosedRequestsTabs.open')}
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
              onClick={() => setActiveTable('closed')}
            >
              {t('openClosedRequestsTabs.closed')}
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
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length === 0 && (
        <div className="padding-x-2 padding-bottom-1 border-bottom-1px margin-top-neg-105 line-height-body-5">
          {t(`state.noRequests.${activeTable}`)}
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

function SystemWorkspaceRequests() {
  const { t } = useTranslation('systemWorkspace');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const linkSearchQuery = linkCedarSystemIdQueryString(systemId);
  const workspacePath = `/systems/${systemId}/workspace`;

  return (
    <MainContent className="grid-container margin-bottom-5 desktop:margin-bottom-10">
      <Breadcrumbs
        items={[
          { text: t('breadcrumbs.home'), url: '/' },
          { text: t('header'), url: workspacePath },
          { text: t('requests.header') }
        ]}
      />

      <PageHeading className="margin-top-6 margin-bottom-05">
        {t('requests.header')}
      </PageHeading>
      <p className="font-body-lg line-height-body-5 text-light margin-y-0">
        {t('requests.subhead')}
      </p>
      <p className="font-body-md text-light line-height-body-4 margin-top-1">
        {t('requests.description')}
      </p>

      <div className="display-flex">
        <IconLink
          className="text-primary"
          icon={<Icon.ArrowBack />}
          to={workspacePath}
        >
          {t('returnToWorkspace')}
        </IconLink>
      </div>

      <div className="bg-base-lightest padding-top-3 padding-bottom-2 padding-x-2 margin-top-4 margin-bottom-6">
        <h4 className="margin-top-0 margin-bottom-1">
          {t('spaces.requests.start')}
        </h4>

        <UswdsReactLink
          className="usa-button usa-button--outline text-primary margin-bottom-1"
          to={{
            search: linkSearchQuery,
            pathname: '/system/request-type'
          }}
          data-testid="new-request-itgov"
        >
          {t('helpLinks.links.0.linkText')}
        </UswdsReactLink>

        <UswdsReactLink
          className="usa-button usa-button--outline text-primary"
          to={{
            search: linkSearchQuery,
            pathname: '/trb/start'
          }}
          data-testid="new-request-itgov"
        >
          {t('helpLinks.links.1.linkText')}
        </UswdsReactLink>
      </div>

      <LinkedRequestsTable systemId={systemId} />
    </MainContent>
  );
}

export default SystemWorkspaceRequests;
