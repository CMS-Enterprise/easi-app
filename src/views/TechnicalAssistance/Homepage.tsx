/**
 * @file "Technical Assistance" (TRB) homepage.
 * Created with reference to `src/views/MakingARequest`, `src/views/MyRequests/Table`.
 */

import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
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
  Link,
  SiteAlert,
  Table
} from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import SectionWrapper from 'components/shared/SectionWrapper';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import GetTrbRequestsQuery from 'queries/GetTrbRequestsQuery';
import {
  GetTrbRequests,
  // eslint-disable-next-line camelcase
  GetTrbRequests_myTrbRequests
} from 'queries/types/GetTrbRequests';
import { AppState } from 'reducers/rootReducer';
import { TRBRequestState } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';
import user from 'utils/user';
import NotFound from 'views/NotFound';

function Homepage() {
  const { t } = useTranslation('technicalAssistance');
  const { url } = useRouteMatch();

  const flags = useFlags();

  // Current user info from redux
  const { groups, isUserSet } = useSelector((state: AppState) => state.auth);

  const { loading, error, data } = useQuery<GetTrbRequests>(
    GetTrbRequestsQuery
  );

  const infoBoxText = t<Record<string, string[]>>('infoBox', {
    returnObjects: true
  });

  // @ts-ignore
  // Ignoring due to accessor props with dot property string values which break react-table typescripting
  // eslint-disable-next-line camelcase
  const columns = useMemo<Column<GetTrbRequests_myTrbRequests>[]>(() => {
    return [
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name',
        Cell: ({
          value,
          row
        }: // eslint-disable-next-line camelcase
        CellProps<GetTrbRequests_myTrbRequests, string>) => {
          return (
            <UswdsReactLink
              to={`/trb/task-list/${row.original.id}`}
              data-testid={`trbRequest-${row.original.id}`}
            >
              {value || t('taskList.defaultName')}
            </UswdsReactLink>
          );
        }
      },

      {
        Header: t<string>('table.header.status'),
        accessor: ({ status, state }) =>
          state === TRBRequestState.CLOSED
            ? t(`table.requestState.${state}`)
            : t(`table.requestStatus.${status}`)
      },
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'form.submittedAt', // This is what breaks the Column type arg
        Cell: ({ value }: { value: string | null }) =>
          value
            ? formatDateLocal(value, 'MM/dd/yyyy')
            : t('check.notYetSubmitted')
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
      data: useMemo(() => data?.myTrbRequests || [], [data?.myTrbRequests]),
      autoResetSortBy: false,
      autoResetPage: true,
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

  // Temp fix for `globalFilterCellText` to work with `page` rows
  // The filter function requires all rows to be prepped so that
  // `Column.Cell` is available during filtering
  rows.map(row => prepareRow(row));

  if (loading || !isUserSet) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      {
        // Admin site alert
        user.isTrbAdmin(groups, flags) && (
          <SiteAlert
            variant="info"
            heading={t('adminInfoBox.heading')}
            className="trb-admin-alert"
            data-testid="trbAdmin-siteAlert"
          >
            <Trans i18nKey="technicalAssistance:adminInfoBox.text">
              indexOne
              <UswdsReactLink to="/">admin</UswdsReactLink>
              indexTwo
            </Trans>
          </SiteAlert>
        )
      }
      <GridContainer className="width-full">
        <SectionWrapper borderBottom>
          <PageHeading className="margin-bottom-0">{t('heading')}</PageHeading>
          <p className="line-height-body-5 font-body-lg text-light margin-y-1">
            {t('subheading')}
          </p>
          <p className="line-height-body-5 margin-top-1">{t('introText')}</p>

          <div className="bg-base-lightest padding-y-205 padding-x-2 margin-y-3">
            <p className="margin-top-0">{infoBoxText.text[0]}</p>
            <ul>
              {infoBoxText.list.map(item => (
                <li key={item} className="margin-bottom-1">
                  {item}
                </li>
              ))}
            </ul>
            <p className="margin-bottom-0">{infoBoxText.text[1]}</p>
          </div>

          <p className="margin-bottom-3">
            <Trans i18nKey="technicalAssistance:questions">
              indexOne
              <Link href="mailto:cms-trb@cms.hhs.gov">email</Link>
              indexTwo
            </Trans>
          </p>

          <UswdsReactLink
            to={`${url}/start`}
            className="usa-button margin-bottom-5"
            variant="unstyled"
          >
            {t('nextStep')}
          </UswdsReactLink>
        </SectionWrapper>

        <div className="trb-requests-table">
          <h2>{t('table.heading')}</h2>

          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            tableID={t('systemTable.id')}
            tableName={t('systemTable.title')}
            className="margin-bottom-4 maxw-mobile-lg"
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
                // prepareRow(row); // Temp prepare all rows before render out, until fixed
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

          {rows.length === 0 && (
            <div className="padding-bottom-2 border-bottom-1px margin-top-neg-05">
              {t('table.noRequests')}
            </div>
          )}

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
        </div>
      </GridContainer>
    </>
  );
}

export default Homepage;
