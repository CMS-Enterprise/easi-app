import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Column, useSortBy, useTable } from 'react-table';
import { Button, Link, Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import {
  AccessibilityRequestDocumentCommonType,
  AccessibilityRequestDocumentStatus
} from 'types/graphql-global-types';
import { translateDocumentType } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';
import { getHeaderSortIcon } from 'utils/tableSort';

type Document = {
  id: string;
  status: AccessibilityRequestDocumentStatus;
  translatedStatus: string;
  url: string;
  uploadedAt: string;
  documentType: {
    commonType: AccessibilityRequestDocumentCommonType;
    otherTypeDescription: string | null;
  };
};

type DocumentsListProps = {
  documents: Document[];
  requestName: string;
  removeDocument: (
    id: string,
    documentType: string,
    callback: () => void
  ) => void;
};

const AccessibilityDocumentsList = ({
  documents,
  requestName,
  removeDocument
}: DocumentsListProps) => {
  const { t } = useTranslation('accessibility');
  const [document, setDocument] = useState<Document | null>(null);

  const columns = useMemo<Column<Document>[]>(() => {
    return [
      {
        Header: t<string>('documentTable.header.documentName'),
        accessor: 'documentType',
        Cell: ({ value }: any) => translateDocumentType(value)
      },
      {
        Header: t<string>('documentTable.header.uploadedAt'),
        accessor: 'uploadedAt',
        width: '25%'
      },
      {
        Header: t<string>('documentTable.header.actions'),
        accessor: 'translatedStatus',
        Cell: ({ row, value }: Cell<Document>) => (
          <>
            {value === t('documentTable.status.pending') && <em>{value}</em>}
            {value === t('documentTable.view') && (
              <>
                <Link
                  className="margin-right-3"
                  target="_blank"
                  rel="noreferrer"
                  href={row.original.url}
                  data-testid="view-document"
                  aria-label={`View ${translateDocumentType(
                    row.original.documentType
                  )} in a new tab or window`}
                >
                  {value}
                </Link>
                <Button
                  aria-label={`Remove ${translateDocumentType(
                    row.original.documentType
                  )}`}
                  type="button"
                  unstyled
                  data-testid="remove-document"
                  onClick={() => setDocument(row.original)}
                >
                  {t('documentTable.remove')}
                </Button>
              </>
            )}
            {value === t('documentTable.status.unavailable') && (
              <>
                <i className="fa fa-exclamation-circle text-secondary" />{' '}
                {value}
              </>
            )}
          </>
        )
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => {
    const tableData = documents.map((singleDoc: Document) => {
      const uploadedAt = singleDoc.uploadedAt
        ? formatDate(DateTime.fromISO(singleDoc.uploadedAt))
        : '';

      let translatedStatus;
      switch (singleDoc.status) {
        case 'PENDING':
          translatedStatus = t('documentTable.status.pending');
          break;
        case 'AVAILABLE':
          translatedStatus = t('documentTable.view');
          break;
        case 'UNAVAILABLE':
          translatedStatus = t('documentTable.status.unavailable');
          break;
        default:
          translatedStatus = '';
          break;
      }

      return {
        ...singleDoc,
        translatedStatus,
        uploadedAt
      };
    });

    return tableData;
  }, [documents, t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      documents,
      initialState: {
        sortBy: useMemo(() => [{ id: 'uploadedAt', desc: true }], [])
      }
    },
    useSortBy
  );

  if (documents.length === 0) {
    return <div>{t('documentTable.noDocuments')}</div>;
  }
  return (
    <div data-testid="accessibility-documents-list">
      <Table bordered={false} {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">
          {`${t('documentTable.caption')} ${requestName}`}
        </caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    width: column.width
                  }}
                  scope="col"
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {column.isSorted && (
                      <span
                        className={getHeaderSortIcon(
                          column.isSorted,
                          column.isSortedDesc
                        )}
                      />
                    )}
                    {!column.isSorted && (
                      <span className="margin-left-1 fa fa-sort caret" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr data-testurl={row.original.url} {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th
                        {...cell.getCellProps()}
                        scope="row"
                        style={{ maxWidth: '16rem' }}
                      >
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td {...cell.getCellProps()} style={{ maxWidth: '16rem' }}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal isOpen={!!document} closeModal={() => setDocument(null)}>
        {document && (
          <>
            <PageHeading
              headingLevel="h2"
              className="margin-top-0 line-height-heading-2 margin-bottom-2"
            >
              {t('documentTable.modal.header', {
                name: translateDocumentType(document.documentType)
              })}
            </PageHeading>
            <span>{t('documentTable.modal.warning')}</span>
            <div className="display-flex margin-top-2">
              <Button
                type="button"
                className="margin-right-5"
                data-testid="remove-document-confirm"
                onClick={() =>
                  removeDocument(
                    document.id,
                    translateDocumentType(document.documentType),
                    () => setDocument(null)
                  )
                }
              >
                {t('documentTable.modal.proceedButton')}
              </Button>
              <Button type="button" unstyled onClick={() => setDocument(null)}>
                {t('documentTable.modal.declineButton')}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AccessibilityDocumentsList;
