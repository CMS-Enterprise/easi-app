import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CellProps,
  Column,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Button, Table } from '@trussworks/react-uswds';
import {
  GetSystemIntakeDocument,
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentFragmentFragment,
  SystemIntakeDocumentStatus,
  useDeleteSystemIntakeDocumentMutation
} from 'gql/generated/graphql';

import Modal from 'components/Modal';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import useMessage from 'hooks/useMessage';
import { formatDateLocal } from 'utils/date';
import { downloadFileFromURL } from 'utils/downloadFile';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

type DocumentsTableProps = {
  systemIntakeId: string;
  documents: SystemIntakeDocumentFragmentFragment[];
  className?: string;
  hideRemoveButton?: boolean;
};

/**
 * System intake document upload form step
 */
const DocumentsTable = ({
  systemIntakeId,
  documents,
  className,
  hideRemoveButton
}: DocumentsTableProps) => {
  const { t } = useTranslation();

  const { showMessage } = useMessage();

  const [fileToDelete, setFileToDelete] =
    useState<SystemIntakeDocumentFragmentFragment | null>(null);

  const [deleteDocument] = useDeleteSystemIntakeDocumentMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeDocument,
        variables: {
          id: systemIntakeId
        }
      }
    ]
  });

  const columns = useMemo<
    Column<SystemIntakeDocumentFragmentFragment>[]
  >(() => {
    return [
      {
        Header: t<string>('intake:documents.table.fileName'),
        accessor: 'fileName'
      },
      {
        Header: t<string>('intake:documents.table.docType'),
        accessor: ({ documentType: { commonType, otherTypeDescription } }) => {
          if (commonType === SystemIntakeDocumentCommonType.OTHER) {
            return otherTypeDescription || '';
          }
          return t(`intake:documents.abbreviatedType.${commonType}`);
        },
        Cell: ({
          row
        }: CellProps<SystemIntakeDocumentFragmentFragment, string>) => {
          const { version } = row.original;
          return (
            <>
              <p>{row.values[t('intake:documents.table.docType')]}</p>
              <p className="text-base font-sans-2xs">
                {t(`intake:documents.version.${version}`)}
              </p>
            </>
          );
        }
      },
      {
        Header: t<string>('intake:documents.table.dateAdded'),
        accessor: 'uploadedAt',
        Cell: cell => {
          const { value } = cell;
          return <>{formatDateLocal(value, 'MM/dd/yyyy')}</>;
        }
      },
      {
        Header: t<string>('intake:documents.table.actions'),
        accessor: ({ status }) => {
          // Repurpose the accessor to use `status` for sorting order
          if (status === SystemIntakeDocumentStatus.PENDING) return 1;
          if (status === SystemIntakeDocumentStatus.AVAILABLE) return 2;
          if (status === SystemIntakeDocumentStatus.UNAVAILABLE) return 3;
          return 4;
        },
        Cell: ({
          row
        }: CellProps<SystemIntakeDocumentFragmentFragment, string>) => {
          // Show the upload status
          // Virus scanning
          if (row.original.status === SystemIntakeDocumentStatus.PENDING) {
            return (
              <em data-testurl={row.original.url}>
                {t('technicalAssistance:documents.table.virusScan')}
              </em>
            );
          }
          // View or Remove
          if (row.original.status === SystemIntakeDocumentStatus.AVAILABLE) {
            // Show some file actions once it's available
            const {
              fileName: documentName,
              canView,
              canDelete,
              url: documentUrl
            } = row.original;

            return (
              <div className="display-flex flex-row">
                {
                  /* View document */
                  canView && (
                    <Button
                      type="button"
                      unstyled
                      onClick={() =>
                        downloadFileFromURL(documentUrl, documentName)
                      }
                    >
                      {t('intake:documents.table.downloadBtn')}
                    </Button>
                  )
                }

                {
                  /* Delete document */
                  canDelete && !hideRemoveButton && (
                    <Button
                      unstyled
                      type="button"
                      className="margin-left-2 text-error"
                      onClick={() => setFileToDelete(row.original)}
                    >
                      {t('intake:documents.table.removeBtn')}
                    </Button>
                  )
                }
              </div>
            );
          }
          // Infected unavailable
          if (row.original.status === SystemIntakeDocumentStatus.UNAVAILABLE) {
            return <>{t('technicalAssistance:documents.table.unavailable')}</>;
          }
          return <></>;
        }
      }
    ];
  }, [t, hideRemoveButton]);

  const table = useTable(
    {
      columns,
      data: documents,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'uploadedAt', desc: true }], []),
        pageIndex: 0,
        pageSize: 5
      }
    },
    useSortBy,
    usePagination
  );

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    setPageSize
  } = table;

  const ConfirmDeleteModal = () => {
    if (!fileToDelete) return null;
    return (
      <Modal isOpen={!!fileToDelete} closeModal={() => setFileToDelete(null)}>
        <h3 className="margin-top-0 margin-bottom-0">
          {t('intake:documents.table.removeModal.heading', {
            documentName: fileToDelete.fileName
          })}
        </h3>

        <p>{t('intake:documents.table.removeModal.explanation')}</p>

        <Button
          type="button"
          secondary
          onClick={() => {
            deleteDocument({ variables: { id: fileToDelete.id } })
              .then(() => {
                showMessage(
                  t('intake:documents.table.removeModal.success', {
                    documentName: fileToDelete.fileName
                  }),
                  {
                    type: 'success'
                  }
                );
              })
              .catch(() => {
                showMessage(t('intake:documents.table.removeModal.error'), {
                  type: 'error'
                });
              });

            setFileToDelete(null);
          }}
        >
          {t('intake:documents.table.removeModal.confirm')}
        </Button>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => setFileToDelete(null)}
        >
          {t('intake:documents.table.removeModal.cancel')}
        </Button>
      </Modal>
    );
  };

  return (
    <div
      id="systemIntakeDocuments"
      data-testid="system-intake-documents"
      className={className}
    >
      <ConfirmDeleteModal />

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
          {page.map(row => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.original.id}
                data-testid={`document-row-${row.original.id}`}
              >
                {row.cells.map(cell => {
                  return (
                    <td
                      className="text-ttop"
                      {...cell.getCellProps()}
                      key={{ ...cell.getCellProps() }.key}
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
      {rows.length > 5 && (
        <div className="display-flex flex-row flex-justify-between">
          <TablePagination
            {...table}
            pageIndex={table.state.pageIndex}
            pageSize={table.state.pageSize}
            page={[]}
            className="desktop:grid-col-fill desktop:padding-bottom-0"
          />
          <TablePageSize
            className="desktop:grid-col-auto"
            pageSize={table.state.pageSize}
            setPageSize={setPageSize}
          />
        </div>
      )}
      {!documents.length && (
        <p className="text-italic">{t('intake:documents.noDocuments')}</p>
      )}
    </div>
  );
};

export default DocumentsTable;
