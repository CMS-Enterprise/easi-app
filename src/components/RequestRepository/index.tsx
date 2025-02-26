import React, { useContext, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Row,
  SortingRule,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  GridContainer,
  ModalFooter,
  ModalHeading,
  Table
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useGetSystemIntakesTableQuery } from 'gql/generated/graphql';
import { startCase } from 'lodash';
import { ActiveStateType, TableStateContext } from 'wrappers/TableStateWrapper';

import CsvDownloadLink from 'components/CsvDownloadLink';
import DatePickerFormatted from 'components/DatePickerFormatted';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { convertIntakeToCSV } from 'data/systemIntake';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import useTableState from 'hooks/useTableState';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import dateRangeSchema from 'validations/dateRangeSchema';

import csvHeaderMap from './csvHeaderMap';
import csvPortfolioReportHeaderMap from './csvPortfolioReportHeaderMap';
import tableMap, { SystemIntakeForTable } from './tableMap';
import useRequestTableColumns from './useRequestTableColumns';

import './index.scss';

type SystemIntakesData = {
  open: SystemIntakeForTable[];
  closed: SystemIntakeForTable[];
};

const RequestRepository = () => {
  const isMobile = useCheckResponsiveScreen('tablet');
  const { t } = useTranslation('governanceReviewTeam');

  const { itGovAdmin } = useContext(TableStateContext);
  const [activeTable, setActiveTable] = useState<ActiveStateType>(
    itGovAdmin.current.activeTableState
  );

  /* Controls Portfolio Update Report info modal */
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  /* Controls Configure Portfolio Update Report modal */
  const [configReportModalOpen, setConfigReportModalOpen] =
    useState<boolean>(false);

  /* Date range for Portfolio Update Report */
  const { control, handleSubmit, watch } = useForm<{
    dateStart: string;
    dateEnd: string;
  }>({ resolver: yupResolver(dateRangeSchema) });
  const dateRangeStart = watch('dateStart');
  const dateRangeEnd = watch('dateEnd');

  // GQL query to get all OPEN system intakes
  const { data: openIntakes, loading: loadingOpen } =
    useGetSystemIntakesTableQuery({
      variables: { openRequests: true }
    });

  // GQL query to get all CLOSED system intakes
  const { data: closedIntakes, loading: loadingClosed } =
    useGetSystemIntakesTableQuery({
      variables: { openRequests: false }
    });

  /** Object containing formatted system intakes split by `open` and `closed` state */
  const systemIntakes: SystemIntakesData = useMemo(
    () => ({
      open: openIntakes?.systemIntakes
        ? tableMap(openIntakes.systemIntakes, t)
        : [],
      closed: closedIntakes?.systemIntakes
        ? tableMap(closedIntakes.systemIntakes, t)
        : []
    }),
    [openIntakes, closedIntakes, t]
  );

  // Returns array of intakes based on active table
  const data: SystemIntakeForTable[] = useMemo(
    () => systemIntakes[activeTable],
    [systemIntakes, activeTable]
  );

  /** Portfolio Update Report data for CSV based on selected date range */
  const portfolioUpdateReport = useMemo(() => {
    // If no intakes or selected dates, return empty array
    if (systemIntakes.closed.length === 0 || !dateRangeStart || !dateRangeEnd) {
      return [];
    }

    // Return closed system intakes filtered by selected date range
    return systemIntakes.closed.filter(({ filterDate }) => {
      if (!filterDate) return false;

      return filterDate > dateRangeStart && filterDate < dateRangeEnd;
    });
  }, [systemIntakes.closed, dateRangeStart, dateRangeEnd]);

  /** Convert selected intakes to CSV format */
  const convertIntakesToCSV = (
    intakes: SystemIntakeForTable[]
  ): SystemIntakeForTable[] => intakes.map(convertIntakeToCSV);

  const csvHeaders = csvHeaderMap(t);
  const csvPortfolioReportHeaders = csvPortfolioReportHeaderMap(t);

  /** Default page size from local storage */
  const defaultPageSize: number = window.localStorage['request-table-page-size']
    ? Number(window.localStorage['request-table-page-size'])
    : 50;

  // Last sort states on active tables with their initial sort rules
  const [lastSort, setLastSort] = useState<
    Record<ActiveStateType, SortingRule<{}>[]>
  >({
    open: [{ id: 'submittedAt', desc: true }],
    closed: [{ id: 'lastAdminNote', desc: true }]
  });

  // Select an active table and restore its last sort state
  function selectActiveTable(nextActiveTable: ActiveStateType) {
    if (nextActiveTable === activeTable) return;
    gotoPage(0);
    setLastSort(prev => ({ ...prev, [activeTable]: state.sortBy }));
    setActiveTable(nextActiveTable);
    setSortBy(lastSort[nextActiveTable]);
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state,
    page,
    prepareRow,
    rows,
    setSortBy
  } = useTable(
    {
      // TODO: Fix type issue
      // @ts-ignore
      columns: useRequestTableColumns(activeTable),
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      globalFilter: useMemo(() => globalFilterCellText, []),
      data,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => lastSort[activeTable], [lastSort, activeTable]),
        pageIndex: itGovAdmin.current.state.pageIndex,
        pageSize: defaultPageSize
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
    'itGovAdmin',
    state,
    gotoPage,
    setSortBy,
    setGlobalFilter,
    activeTable,
    data
  );

  /** Returns query loading state based on active table */
  const resultsLoading = useMemo(() => {
    if (activeTable === 'closed') {
      return loadingClosed;
    }

    return loadingOpen;
  }, [loadingOpen, loadingClosed, activeTable]);

  return (
    <>
      <GridContainer className="margin-top-1 margin-bottom-2">
        <ButtonGroup className="trb-admin-team-home-actions">
          {/* Configure Portfolio Update Report button */}
          <Button
            type="button"
            onClick={() => setConfigReportModalOpen(true)}
            className="margin-right-1"
          >
            {t('home:adminHome.GRT.configureReport.button')}
          </Button>
          {/* Portfolio Update Report info modal trigger button */}
          <Button type="button" onClick={() => setInfoModalOpen(true)} unstyled>
            {t('home:adminHome.GRT.infoModal.link')}
          </Button>
        </ButtonGroup>
      </GridContainer>
      <GridContainer className="margin-bottom-5 maxw-none">
        {/* Configure Portfolio Update Report modal */}
        <Modal
          isOpen={configReportModalOpen}
          closeModal={() => setConfigReportModalOpen(false)}
        >
          <ModalHeading>
            {t('home:adminHome.GRT.configureReport.heading')}
          </ModalHeading>

          <p>{t('home:adminHome.GRT.configureReport.content')}</p>

          <Form onSubmit={handleSubmit(formData => null)} className="maxw-none">
            <Controller
              name="dateStart"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup error={!!error}>
                  <Label htmlFor={field.name}>
                    {t('home:adminHome.GRT.configureReport.rangeStart')}
                  </Label>
                  <HelpText className="margin-top-05">mm/dd/yyyy</HelpText>
                  {error?.message && (
                    <FieldErrorMsg>
                      {t('home:adminHome.GRT.configureReport.error')}
                    </FieldErrorMsg>
                  )}
                  <DatePickerFormatted
                    {...field}
                    id={field.name}
                    format={dt => dt.toUTC().startOf('day').toISO()}
                  />
                </FormGroup>
              )}
            />
            <Controller
              name="dateEnd"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup error={!!error}>
                  <Label htmlFor={field.name}>
                    {t('home:adminHome.GRT.configureReport.rangeEnd')}
                  </Label>
                  <HelpText className="margin-top-05">mm/dd/yyyy</HelpText>
                  {error?.message && (
                    <FieldErrorMsg>
                      {t('home:adminHome.GRT.configureReport.error')}
                    </FieldErrorMsg>
                  )}
                  <DatePickerFormatted
                    {...field}
                    id={field.name}
                    format={dt => dt.toUTC().endOf('day').toISO()}
                  />
                </FormGroup>
              )}
            />

            <ButtonGroup>
              <CSVLink
                data={convertIntakesToCSV(portfolioUpdateReport)}
                filename="EASi-Portfolio-Update-Report.csv"
                headers={csvPortfolioReportHeaders}
                onClick={() => setConfigReportModalOpen(false)}
                className={classnames(
                  'usa-button margin-right-1 text-white text-no-underline',
                  { 'usa-button--disabled': !dateRangeStart || !dateRangeEnd }
                )}
              >
                {t('home:adminHome.GRT.configureReport.download')}
              </CSVLink>

              <Button
                type="button"
                onClick={() => setConfigReportModalOpen(false)}
                unstyled
              >
                {t('home:adminHome.GRT.configureReport.close')}
              </Button>
            </ButtonGroup>
          </Form>
        </Modal>

        {/* Portfolio Update Report info modal */}
        <Modal
          isOpen={infoModalOpen}
          closeModal={() => setInfoModalOpen(false)}
        >
          <ModalHeading>
            {t('home:adminHome.GRT.infoModal.heading')}
          </ModalHeading>
          <Trans
            i18nKey="home:adminHome.GRT.infoModal.content"
            components={{ p: <p className="font-body-sm" /> }}
          />

          <ModalFooter>
            <Button
              type="button"
              onClick={() => setInfoModalOpen(false)}
              unstyled
            >
              {t('Close')}
            </Button>
          </ModalFooter>
        </Modal>

        <nav
          aria-label={t(
            'technicalAssistance:adminTeamHome.existingRequests.tabs.label'
          )}
        >
          <ul className="easi-request-repo__tab-list margin-bottom-4 margin-top-0">
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
                onClick={() => selectActiveTable('open')}
                aria-label={
                  activeTable === 'open' ? 'Open requests selected' : ''
                }
              >
                {t(
                  'technicalAssistance:adminTeamHome.existingRequests.tabs.open.name'
                )}
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
                onClick={() => selectActiveTable('closed')}
                data-testid="view-closed-intakes-btn"
                aria-label={
                  activeTable === 'closed' ? 'Closed requests selected' : ''
                }
              >
                {t(
                  'technicalAssistance:adminTeamHome.existingRequests.tabs.closed.name'
                )}
              </button>
            </li>
          </ul>
        </nav>
        {/* h1 for screen reader */}
        <PageHeading className="usa-sr-only">
          {t('requestRepository.requestCount', {
            context: activeTable,
            count: data.length
          })}
        </PageHeading>

        <div className="margin-bottom-4 desktop:display-flex flex-align-center flex-justify">
          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            initialFilter={itGovAdmin.current.state.globalFilter}
            tableID={t('requestRepository.id')}
            tableName={t('requestRepository.title')}
            className="maxw-tablet margin-bottom-4 desktop:margin-bottom-0 desktop:grid-col-5 tablet:padding-right-6"
          />

          <CsvDownloadLink
            data={convertIntakesToCSV(data)}
            filename={`EASi-${startCase(activeTable)}-ITGO-Requests.csv`}
            headers={csvHeaders}
          >
            {t('home:adminHome.GRT.downloadLabel', { status: activeTable })}
          </CsvDownloadLink>
        </div>

        <TableResults
          globalFilter={state.globalFilter}
          pageIndex={state.pageIndex}
          pageSize={state.pageSize}
          filteredRowLength={page.length}
          rowLength={data.length}
          className="margin-bottom-4"
          loading={resultsLoading}
        />

        {/* This is the only table that expands past the USWDS desktop dimensions.  Only convert to scrollable when in tablet/mobile */}
        <Table
          scrollable={isMobile}
          fullWidth
          bordered={false}
          {...getTableProps()}
        >
          <caption className="usa-sr-only">
            {activeTable === 'open' &&
              t('requestRepository.aria.openTableCaption')}
            {activeTable === 'closed' &&
              t('requestRepository.aria.closedTableCaption')}
          </caption>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    aria-sort={getColumnSortStatus(column)}
                    style={{ position: 'relative' }}
                  >
                    <button
                      className="usa-button usa-button--unstyled"
                      type="button"
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      {getHeaderSortIcon(column)}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            id={`system-intakes-table__${activeTable}`}
          >
            {page.map((row: Row) => {
              return (
                <tr
                  {...row.getRowProps()}
                  // @ts-ignore
                  data-testid={`${row.original.id}-row`}
                >
                  {row.cells.map((cell, i) => {
                    if (i === 0) {
                      return (
                        <th
                          {...cell.getCellProps()}
                          style={{ verticalAlign: 'top' }}
                          scope="row"
                        >
                          {cell.render('Cell')}
                        </th>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{ verticalAlign: 'top' }}
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
            className="desktop:grid-col-fill"
          />
          <TablePageSize
            className="desktop:grid-col-auto"
            pageSize={state.pageSize}
            setPageSize={setPageSize}
          />
        </div>
      </GridContainer>
    </>
  );
};

export default RequestRepository;
