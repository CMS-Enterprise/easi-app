import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';

import UswdsReactLink from '../../components/LinkWrapper';
import GetSystemIntakeRelatedRequests from '../../queries/GetSystemIntakeRelatedRequests';
import { GetSystemIntake } from '../../queries/types/GetSystemIntake';
import { GetSystemIntakeRelatedRequestsVariables } from '../../queries/types/GetSystemIntakeRelatedRequests';
import globalFilterCellText from '../../utils/globalFilterCellText';
import { sortColumnValues } from '../../utils/tableSort';

import { LinkedRequestForTable } from './tableMap';

const RelatedRequestsTable = ({
  requestID,
  pageSize = 10
}: {
  requestID: string;
  pageSize?: number;
}) => {
  const { t } = useTranslation('admin');
  // make api call
  const { loading, error, data } = useQuery<
    GetSystemIntake,
    GetSystemIntakeRelatedRequestsVariables
  >(GetSystemIntakeRelatedRequests, {
    variables: { systemIntakeID: requestID },
    fetchPolicy: 'cache-and-network'
  });

  const tableData = useMemo(() => {
    if (error !== undefined) {
      return [];
    }

    if (loading) {
      return [];
    }

    if (data === undefined || data.systemIntake === null) {
      return [];
    }

    const {
      systemIntake: { relatedIntakes, relatedTRBRequests }
    } = data;

    const requests: LinkedRequestForTable[] = [];

    // handle related intakes
    relatedIntakes.forEach(relatedIntake => {
      requests.push({
        id: relatedIntake.id,
        contractNumber: relatedIntake.contractNumbers.join(', '),
        process: 'IT Governance',
        projectTitle: relatedIntake.requestName || '',
        status: relatedIntake.decisionState,
        submissionDate: relatedIntake.submittedAt || ''
      });
    });

    // handle trb requests
    relatedTRBRequests.forEach(relatedTRBRequest => {
      requests.push({
        id: relatedTRBRequest.id,
        contractNumber: relatedTRBRequest.contractNumbers.join(', '),
        process: 'TRB',
        projectTitle: relatedTRBRequest.name || '',
        status: relatedTRBRequest.status,
        submissionDate: relatedTRBRequest.createdAt
      });
    });
    return requests;
  }, [data, error, loading]);

  const columns: Column<LinkedRequestForTable>[] = useMemo<
    Column<LinkedRequestForTable>[]
  >(() => {
    return [
      {
        Header: t<string>('tableColumns.projectTitle'),
        accessor: 'projectTitle',
        Cell: ({
          row,
          value
        }: {
          row: Row<LinkedRequestForTable>;
          value: string;
        }) => {
          let link: string = '';

          if (row.original.process === 'TRB') {
            link = `/trb/task-list/${row.original.id}`;
          } else {
            link = `/governance-task-list/${row.original.id}`;
          }

          return <UswdsReactLink to={link}>{value}</UswdsReactLink>;
        }
      },
      {
        Header: t<string>('tableColumns.process'),
        accessor: 'process'
      },
      {
        Header: t<string>('tableColumns.contractNumber'),
        accessor: 'contractNumber'
      },
      {
        Header: t<string>('tableColumns.status'),
        accessor: 'status'
      },
      {
        Header: t<string>('tableColumns.submissionDate'),
        accessor: 'submissionDate'
      }
    ];
  }, [t]);

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
    page,
    rows,
    setGlobalFilter,
    state,
    prepareRow
  } = useTable(
    {
      columns,
      data: tableData,
      sortTypes: {
        alphanumeric: (
          rowOne: Row<LinkedRequestForTable>,
          rowTwo: Row<LinkedRequestForTable>,
          columnName: string
        ) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      globalFilter: useMemo(() => globalFilterCellText, []),
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], []),
        pageIndex: 0,
        pageSize
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));
  return <div>table!</div>;
};

export default RelatedRequestsTable;
