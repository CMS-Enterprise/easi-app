import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column, useSortBy, useTable } from 'react-table';
import { useMutation } from '@apollo/client';
import { Button, Link, Table } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import { DeleteSystemIntakeDocumentQuery } from 'queries/SystemIntakeDocumentQueries';
import {
  DeleteSystemIntakeDocument,
  DeleteSystemIntakeDocumentVariables
} from 'queries/types/DeleteSystemIntakeDocument';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import { SystemIntakeDocument } from 'queries/types/SystemIntakeDocument';
import {
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentStatus
} from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

type DocumentsTableProps = {
  systemIntake: SystemIntake;
};

const documents = [
  {
    id: '3b23fcf9-85d3-4211-a7d8-d2d08148f196',
    fileName: 'sample.pdf',
    documentType: {
      commonType: 'OTHER',
      otherTypeDescription: 'Some other type of doc',
      __typename: 'SystemIntakeDocumentType'
    },
    status: 'AVAILABLE',
    uploadedAt: '2023-06-14T18:24:46.310929Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/ead3f487-8aaa-47d2-aa26-335e9b560a92.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=f71d5d63d68958a2bd8526c2b2cdd5abe78b21eb69d10739fe8f8e6fd5d010ec',
    __typename: 'SystemIntakeDocument'
  },
  {
    id: '8cd01e45-810d-445d-b702-b31b8e1b1f14',
    fileName: 'sample.pdf',
    documentType: {
      commonType: 'OTHER',
      otherTypeDescription: 'Some other type of doc',
      __typename: 'SystemIntakeDocumentType'
    },
    status: 'UNAVAILABLE',
    uploadedAt: '2023-06-14T18:24:46.32661Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/7e047111-6228-4943-9c4b-0961f27858f4.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=0e3f337697c616b01533accd95a316cbeabeb6990961b9881911c757837cbf95',
    __typename: 'SystemIntakeDocument'
  },
  {
    id: 'f7138102-c9aa-4215-a331-6ee9aedf5ef3',
    fileName: 'sample.pdf',
    documentType: {
      commonType: 'OTHER',
      otherTypeDescription: 'Some other type of doc',
      __typename: 'SystemIntakeDocumentType'
    },
    status: 'PENDING',
    uploadedAt: '2023-06-14T18:24:46.342866Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/f779e8e4-9c78-4b14-bbab-37618447f3f9.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=7e6755645a1f163d41d2fa7c19776d0ceb4cfd3ff8e1c2918c428a551fe44764',
    __typename: 'SystemIntakeDocument'
  }
] as SystemIntakeDocument[];

/**
 * System intake document upload form step
 */
const DocumentsTable = ({ systemIntake }: DocumentsTableProps) => {
  const { t } = useTranslation();

  // const { documents } = systemIntake;

  const [deleteDocument] = useMutation<
    DeleteSystemIntakeDocument,
    DeleteSystemIntakeDocumentVariables
  >(DeleteSystemIntakeDocumentQuery);

  const columns = useMemo<Column<SystemIntakeDocument>[]>(() => {
    return [
      {
        Header: t<string>(
          'technicalAssistance:documents.table.header.fileName'
        ),
        accessor: 'fileName'
      },
      {
        Header: t<string>(
          'technicalAssistance:documents.table.header.documentType'
        ),
        accessor: ({ documentType: { commonType, otherTypeDescription } }) => {
          if (commonType === SystemIntakeDocumentCommonType.OTHER) {
            return otherTypeDescription || '';
          }
          return t(`intake:documents.type.${commonType}`);
        }
      },
      {
        Header: t<string>(
          'technicalAssistance:documents.table.header.uploadDate'
        ),
        accessor: 'uploadedAt',
        Cell: ({ value }) => formatDateLocal(value, 'MM/dd/yyyy')
      },
      {
        Header: t<string>('technicalAssistance:documents.table.header.actions'),
        accessor: ({ status }) => {
          // Repurpose the accessor to use `status` for sorting order
          if (status === SystemIntakeDocumentStatus.PENDING) return 1;
          if (status === SystemIntakeDocumentStatus.AVAILABLE) return 2;
          if (status === SystemIntakeDocumentStatus.UNAVAILABLE) return 3;
          return 4;
        },
        Cell: ({ row }: CellProps<SystemIntakeDocument, string>) => {
          // Show the upload status
          // Virus scanning
          if (row.original.status === SystemIntakeDocumentStatus.PENDING)
            return (
              <em data-testurl={row.original.url}>
                {t('technicalAssistance:documents.table.virusScan')}
              </em>
            );
          // View or Remove
          if (row.original.status === SystemIntakeDocumentStatus.AVAILABLE)
            // Show some file actions once it's available
            return (
              <>
                {/* View document */}
                <Link target="_blank" href={row.original.url}>
                  {t('technicalAssistance:documents.table.view')}
                </Link>

                {/* TODO: Delete document */}
                {/* {canEdit && ( */}
                <Button
                  unstyled
                  type="button"
                  className="margin-left-2 text-error"
                  onClick={() => {
                    deleteDocument({ variables: { id: row.id } });
                    // setModalOpen(true);
                    // setFileToRemove(row.original);
                  }}
                >
                  {t('technicalAssistance:documents.table.remove')}
                </Button>
                {/* )} */}
              </>
            );
          // Infected unavailable
          if (row.original.status === SystemIntakeDocumentStatus.UNAVAILABLE)
            return t('technicalAssistance:documents.table.unavailable');
          return '';
        }
      }
    ];
  }, [
    // canEdit,
    deleteDocument,
    t
  ]);

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

  return (
    <div className="easi-table--bleed-x easi-table--bottomless">
      {/* {renderModal()} */}
      {documents.length ? (
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
      ) : (
        <Alert type="info">
          {t('technicalAssistance:documents.table.noDocuments')}
        </Alert>
      )}
    </div>
  );
};

export default DocumentsTable;
