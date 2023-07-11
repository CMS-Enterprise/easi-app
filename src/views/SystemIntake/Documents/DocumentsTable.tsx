import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column, useSortBy, useTable } from 'react-table';
import { useMutation } from '@apollo/client';
import { Button, Link, Table } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
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

import './index.scss';

type DocumentsTableProps = {
  systemIntake: SystemIntake;
  /**
   * Whether to show remove document button in table
   *
   * Defaults to true
   */
  canEdit?: boolean;
};

/**
 * System intake document upload form step
 */
const DocumentsTable = ({
  systemIntake,
  canEdit = true
}: DocumentsTableProps) => {
  const { t } = useTranslation();

  const { showMessage } = useMessage();

  const [fileToDelete, setFileToDelete] = useState<SystemIntakeDocument | null>(
    null
  );

  const { documents } = systemIntake;

  const [deleteDocument] = useMutation<
    DeleteSystemIntakeDocument,
    DeleteSystemIntakeDocumentVariables
  >(DeleteSystemIntakeDocumentQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id: systemIntake.id
        }
      }
    ]
  });

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

                {
                  /* Delete document */
                  canEdit && (
                    <Button
                      unstyled
                      type="button"
                      className="margin-left-2 text-error"
                      onClick={() => setFileToDelete(row.original)}
                    >
                      {t('technicalAssistance:documents.table.remove')}
                    </Button>
                  )
                }
              </>
            );
          // Infected unavailable
          if (row.original.status === SystemIntakeDocumentStatus.UNAVAILABLE)
            return t('technicalAssistance:documents.table.unavailable');
          return '';
        }
      }
    ];
  }, [canEdit, setFileToDelete, t]);

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

  const ConfirmDeleteModal = () => {
    if (!fileToDelete) return null;
    return (
      <Modal isOpen={!!fileToDelete} closeModal={() => setFileToDelete(null)}>
        <h3 className="margin-top-0 margin-bottom-0">
          {t(
            'technicalAssistance:documents.supportingDocuments.removeHeading',
            {
              documentName: fileToDelete.fileName
            }
          )}
        </h3>

        <p>
          {t('technicalAssistance:documents.supportingDocuments.removeInfo')}
        </p>

        <Button
          type="button"
          onClick={() => {
            deleteDocument({ variables: { id: fileToDelete.id } })
              .then(() => {
                showMessage(
                  <Alert type="success">
                    {t(
                      'technicalAssistance:documents.supportingDocuments.removeSuccess',
                      {
                        documentName: fileToDelete.fileName
                      }
                    )}
                  </Alert>
                );
              })
              .catch(() => {
                showMessage(
                  <Alert type="error">
                    {t(
                      'technicalAssistance:documents.supportingDocuments.removeFail'
                    )}
                  </Alert>
                );
              });

            setFileToDelete(null);
          }}
        >
          {t(
            'technicalAssistance:documents.supportingDocuments.removeDocument'
          )}
        </Button>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => setFileToDelete(null)}
        >
          {t('technicalAssistance:documents.supportingDocuments.cancel')}
        </Button>
      </Modal>
    );
  };

  return (
    <div id="systemIntakeDocuments">
      <ConfirmDeleteModal />

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

      {!documents.length && <p>{t('intake:documents.noDocuments')}</p>}
    </div>
  );
};

export default DocumentsTable;
