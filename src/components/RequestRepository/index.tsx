import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  CellProps,
  Column,
  Row,
  SortingRule,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  GridContainer,
  IconError,
  ModalFooter,
  ModalHeading,
  Table
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { lowerCase, startCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import CsvDownloadLink from 'components/shared/CsvDownloadLink';
import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TruncatedText from 'components/shared/TruncatedText';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { convertIntakeToCSV } from 'data/systemIntake';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import useTableState from 'hooks/useTableState';
import GetSystemIntakesTableQuery from 'queries/GetSystemIntakesTableQuery';
import { GetSystemIntakesTable } from 'queries/types/GetSystemIntakesTable';
import { SystemIntakeState } from 'types/graphql-global-types';
import { fetchSystemIntakes } from 'types/routines';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import dateRangeSchema from 'validations/dateRangeSchema';
import { ActiveStateType, TableStateContext } from 'views/TableStateWrapper';

import csvHeaderMap from './csvHeaderMap';
import csvPortfolioReportHeaderMap from './csvPortfolioReportHeaderMap';
import tableMap, { SystemIntakeForTable } from './tableMap';

import './index.scss';

type SystemIntakesData = {
  open: SystemIntakeForTable[];
  closed: SystemIntakeForTable[];
};

const RequestRepository = () => {
  const isMobile = useCheckResponsiveScreen('tablet');
  const { t } = useTranslation('governanceReviewTeam');
  const dispatch = useDispatch();

  const flags = useFlags();

  const { data: queryData } = useQuery<GetSystemIntakesTable>(
    GetSystemIntakesTableQuery
  );

  /** Object containing formatted system intakes split by `open` and `closed` state */
  const systemIntakes: SystemIntakesData = useMemo(() => {
    const intakes: SystemIntakesData = { open: [], closed: [] };

    if (!queryData?.systemIntakes) return intakes;

    // Return table data formatted for sorting and cell configuration
    return tableMap(queryData?.systemIntakes, t).reduce<SystemIntakesData>(
      (acc, intake) => {
        /** State converted to lowercase */
        const stateKey = lowerCase(
          intake.state
        ) as Lowercase<SystemIntakeState>;

        return {
          ...acc,
          [stateKey]: [...acc[stateKey], intake]
        };
      },
      intakes
    );
  }, [queryData, t]);

  const { itGovAdmin } = useContext(TableStateContext);

  const [activeTable, setActiveTable] = useState<ActiveStateType>(
    itGovAdmin.current.activeTableState
  );

  /* Controls Portfolio Update Report info modal */
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  /* Controls Configure Portfolio Update Report modal */
  const [configReportModalOpen, setConfigReportModalOpen] = useState<boolean>(
    false
  );

  /* Date range for Portfolio Update Report */
  const { control, handleSubmit, watch } = useForm<{
    dateStart: string;
    dateEnd: string;
  }>({
    resolver: yupResolver(dateRangeSchema),
    defaultValues: {
      dateStart: '2023-09-01T05:00:00.000Z',
      dateEnd: '2023-10-31T05:00:00.000Z'
    }
  });
  const dateRangeStart = watch('dateStart');
  const dateRangeEnd = watch('dateEnd');

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

  // Character limit for length of free text (Admin Note, LCID Scope, etc.), any
  // text longer then this limit will be displayed with a button to allow users
  // to expand/unexpand the text
  const freeFormTextCharLimit = 25;

  const submissionDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.submissionDate'),
    accessor: 'submittedAt',
    Cell: cell => {
      if (cell.value) {
        return formatDateLocal(cell.value, 'MM/dd/yyyy');
      }

      return t('requestRepository.table.submissionDate.null');
    }
  };

  const requestNameColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.projectName'),
    accessor: 'requestName',
    Cell: ({
      row,
      value
    }: CellProps<
      SystemIntakeForTable,
      SystemIntakeForTable['requestName']
    >) => {
      return (
        <Link to={`/governance-review-team/${row.original.id}/intake-request`}>
          {value}
        </Link>
      );
    }
  };

  const requesterColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:contactDetails.requester'),
    accessor: 'requesterNameAndComponent'
  };

  const adminLeadColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.adminLead'),
    accessor: ({ adminLead }) =>
      adminLead || t<string>('governanceReviewTeam:adminLeads.notAssigned'),
    Cell: ({
      value: adminLead
    }: CellProps<SystemIntakeForTable, SystemIntakeForTable['adminLead']>) => {
      if (adminLead === t('governanceReviewTeam:adminLeads.notAssigned')) {
        return (
          <div className="display-flex flex-align-center">
            {/* TODO: should probably make this a button that opens up the assign admin
                lead automatically. Similar to the Dates functionality */}
            <IconError className="text-secondary margin-right-05" />
            {adminLead}
          </div>
        );
      }
      return adminLead;
    }
  };

  const grtDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.grtDate'),
    accessor: 'grtDate',
    Cell: ({
      row,
      value
    }: CellProps<SystemIntakeForTable, SystemIntakeForTable['grtDate']>) => {
      if (!value) {
        return (
          <UswdsReactLink
            data-testid="add-grt-date-cta"
            to={`/governance-review-team/${row.original.id}/dates`}
          >
            {t('requestRepository.table.addDate')}
          </UswdsReactLink>
        );
      }
      return formatDateUtc(value, 'MM/dd/yyyy');
    }
  };

  const grbDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.grbDate'),
    accessor: 'grbDate',
    Cell: ({
      row,
      value
    }: CellProps<SystemIntakeForTable, SystemIntakeForTable['grbDate']>) => {
      if (!value) {
        return (
          <UswdsReactLink
            data-testid="add-grb-date-cta"
            to={`/governance-review-team/${row.original.id}/dates`}
          >
            {t('requestRepository.table.addDate')}
          </UswdsReactLink>
        );
      }
      return formatDateUtc(value, 'MM/dd/yyyy');
    }
  };

  const statusColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.status'),
    accessor: 'status',
    Cell: ({
      row,
      value
    }: CellProps<SystemIntakeForTable, SystemIntakeForTable['status']>) => {
      // If LCID_ISSUED append LCID Scope to status
      if (value === `LCID: ${row.original.lcid}`) {
        return (
          <>
            {value}
            <br />
            <TruncatedText
              id="lcid-scope"
              label="less"
              closeLabel="more"
              text={`Scope: ${row.original.lcidScope}`}
              charLimit={freeFormTextCharLimit}
              className="margin-top-2"
            />
          </>
        );
      }

      // If any other value just display status
      return value;
    }
  };

  const lcidExpirationDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.lcidExpirationDate'),
    accessor: 'lcidExpiresAt',
    Cell: ({ value: lcidExpiresAt }) => {
      if (lcidExpiresAt) {
        return formatDateUtc(lcidExpiresAt, 'MM/dd/yyyy');
      }

      // If no LCID Expiration exists, display 'No LCID Issued'
      return 'No LCID Issued';
    }
  };

  /**
   * TODO: Fix last admin note column
   */

  const lastAdminNoteColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.lastAdminNote'),
    accessor: 'lastAdminNote',
    Cell: ({
      value: lastAdminNote
    }: {
      value: SystemIntakeForTable['lastAdminNote'];
    }) => {
      if (!lastAdminNote) return 'No Admin Notes';

      return (
        // Display admin note using truncated text field that
        // will display note with expandable extra text (if applicable)
        <>
          {formatDateLocal(lastAdminNote.createdAt, 'MM/dd/yyyy')}

          <TruncatedText
            id="last-admin-note"
            label="less"
            closeLabel="more"
            text={lastAdminNote.content}
            charLimit={freeFormTextCharLimit}
          />
        </>
      );
    }
    // TODO: Sort type
    // sortType: (a: Row<LastAdminNote>, b: Row<LastAdminNote>) =>
    //   (a.values.lastAdminNote?.createdAt ?? '') >
    //   (b.values.lastAdminNote?.createdAt ?? '')
    //     ? 1
    //     : -1
  };

  const columns: any = useMemo(() => {
    if (activeTable === 'open') {
      return [
        submissionDateColumn,
        requestNameColumn,
        requesterColumn,
        adminLeadColumn,
        statusColumn,
        grtDateColumn,
        grbDateColumn
      ];
    }
    if (activeTable === 'closed') {
      return [
        submissionDateColumn,
        requestNameColumn,
        requesterColumn,
        lcidExpirationDateColumn,
        statusColumn,
        lastAdminNoteColumn
      ];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTable, t]);

  // Set active table data
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

  useEffect(() => {
    dispatch(fetchSystemIntakes());
  }, [dispatch]);

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
      columns,
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
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => lastSort[activeTable], [lastSort, activeTable]),
        pageSize: defaultPageSize
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  const csvHeaders = csvHeaderMap(t);
  const csvPortfolioReportHeaders = csvPortfolioReportHeaderMap(t);

  const convertIntakesToCSV = (intakes: SystemIntakeForTable[]) => {
    return intakes.map(intake => {
      return convertIntakeToCSV(intake);
    });
  };

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

  return (
    <>
      <GridContainer className="margin-top-1 margin-bottom-2">
        {flags.portfolioUpdateReport ? (
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
            <Button
              type="button"
              onClick={() => setInfoModalOpen(true)}
              unstyled
            >
              {t('home:adminHome.GRT.infoModal.link')}
            </Button>
          </ButtonGroup>
        ) : (
          <CsvDownloadLink
            data={convertIntakesToCSV(data)}
            filename="request-repository.csv"
            headers={csvHeaders}
            className="line-height-body-5"
          >
            {t('home:adminHome.GRT.csvDownloadLabel')}
          </CsvDownloadLink>
        )}
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
                  <DatePickerFormatted {...field} id={field.name} />
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
                  <DatePickerFormatted {...field} id={field.name} />
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

          {flags.portfolioUpdateReport && (
            <CsvDownloadLink
              data={convertIntakesToCSV(data)}
              filename={`EASi-${startCase(activeTable)}-ITGO-Requests.csv`}
              headers={csvHeaders}
            >
              {t('home:adminHome.GRT.downloadLabel', { status: activeTable })}
            </CsvDownloadLink>
          )}
        </div>

        <TableResults
          globalFilter={state.globalFilter}
          pageIndex={state.pageIndex}
          pageSize={state.pageSize}
          filteredRowLength={page.length}
          rowLength={data.length}
          className="margin-bottom-4"
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
          <tbody {...getTableBodyProps()}>
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
