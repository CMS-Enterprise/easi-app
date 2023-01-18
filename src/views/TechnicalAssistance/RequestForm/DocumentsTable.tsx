import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column, useSortBy, useTable } from 'react-table';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Link, Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import Spinner from 'components/Spinner';
import DeleteTrbRequestDocumentQuery from 'queries/DeleteTrbRequestDocumentQuery';
import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import {
  DeleteTrbRequestDocument,
  DeleteTrbRequestDocumentVariables
} from 'queries/types/DeleteTrbRequestDocument';
import {
  GetTrbRequestDocuments,
  GetTrbRequestDocuments_trbRequest_documents as TrbRequestDocuments,
  GetTrbRequestDocumentsVariables
} from 'queries/types/GetTrbRequestDocuments';
import {
  TRBDocumentCommonType,
  TRBRequestDocumentStatus
} from 'types/graphql-global-types';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

import { RefetchDocuments } from './Documents';

type Props = {
  trbRequestId: string;
  setRefetchDocuments?: React.Dispatch<React.SetStateAction<RefetchDocuments>>;
  setLoadingDocuments?: React.Dispatch<React.SetStateAction<boolean>>;
  setDocumentsCount?: React.Dispatch<React.SetStateAction<number>>;
};

function DocumentsTable({
  trbRequestId,
  setRefetchDocuments,
  setLoadingDocuments,
  setDocumentsCount
}: Props) {
  const { t } = useTranslation('technicalAssistance');

  const { data, refetch, loading } = useQuery<
    GetTrbRequestDocuments,
    GetTrbRequestDocumentsVariables
  >(GetTrbRequestDocumentsQuery, {
    variables: { id: trbRequestId }
  });

  const documents = data?.trbRequest.documents || [];

  useEffect(() => {
    setRefetchDocuments?.(() => refetch);
    setLoadingDocuments?.(loading);
    setDocumentsCount?.(documents.length);
  }, [
    documents.length,
    loading,
    refetch,
    setDocumentsCount,
    setLoadingDocuments,
    setRefetchDocuments
  ]);

  // Documents can be deleted from the table
  const [deleteDocument] = useMutation<
    DeleteTrbRequestDocument,
    DeleteTrbRequestDocumentVariables
  >(DeleteTrbRequestDocumentQuery);

  const columns = useMemo<Column<TrbRequestDocuments>[]>(() => {
    return [
      {
        Header: t<string>('documents.table.header.fileName'),
        accessor: 'fileName'
      },
      {
        Header: t<string>('documents.table.header.documentType'),
        accessor: ({ documentType: { commonType, otherTypeDescription } }) => {
          if (commonType === TRBDocumentCommonType.OTHER) {
            return otherTypeDescription || '';
          }
          return t(`documents.upload.type.${commonType}`);
        }
      },
      {
        Header: t<string>('documents.table.header.uploadDate'),
        accessor: 'uploadedAt',
        Cell: ({ value }) => DateTime.fromISO(value).toFormat('MM/dd/yyyy')
      },
      {
        Header: t<string>('documents.table.header.actions'),
        accessor: ({ status }) => {
          // Repurpose the accessor to use `status` for sorting order
          if (status === TRBRequestDocumentStatus.PENDING) return 1;
          if (status === TRBRequestDocumentStatus.AVAILABLE) return 2;
          if (status === TRBRequestDocumentStatus.UNAVAILABLE) return 3;
          return 4;
        },
        Cell: ({ row }: CellProps<TrbRequestDocuments, string>) => {
          // Show the upload status
          // Virus scanning
          if (row.original.status === TRBRequestDocumentStatus.PENDING)
            return (
              <em data-testurl={row.original.url}>
                {t('documents.table.virusScan')}
              </em>
            );
          // View or Remove
          if (row.original.status === TRBRequestDocumentStatus.AVAILABLE)
            // Show some file actions once it's available
            return (
              <>
                {/* View document */}
                <Link target="_blank" href={row.original.url}>
                  {t('documents.table.view')}
                </Link>
                {/* Delete document */}
                <Button
                  unstyled
                  type="button"
                  className="margin-left-2 text-error"
                  onClick={() => {
                    deleteDocument({
                      variables: { id: row.original.id }
                    })
                      .then(() => {
                        refetch(); // Refresh doc list
                      })
                      .catch(() => {
                        // todo no top level error message for the delete yet
                      });
                  }}
                >
                  {t('documents.table.remove')}
                </Button>
              </>
            );
          // Infected unavailable
          if (row.original.status === TRBRequestDocumentStatus.UNAVAILABLE)
            return t('documents.table.unavailable');
          return '';
        }
      }
    ];
  }, [deleteDocument, refetch, t]);

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows
  } = useTable(
    {
      columns,
      data: documents,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'uploadedAt', desc: true }], [])
      }
    },
    useSortBy
  );

  if (loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" aria-busy />
      </div>
    );
  }

  return (
    <div>
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
          {rows.map(row => {
            prepareRow(row);
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
      {data && documents.length === 0 && (
        <div className="font-body-2xs margin-left-2">
          {t('documents.table.noDocument')}
        </div>
      )}
    </div>
  );
}

export default DocumentsTable;
