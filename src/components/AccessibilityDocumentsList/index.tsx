import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Column, useTable } from 'react-table';
import { Button, Link, Table } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import {
  AccessibilityRequestDocumentCommonType,
  AccessibilityRequestDocumentStatus
} from 'types/graphql-global-types';
import { translateDocumentType } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';

type Document = {
  id: string;
  status: AccessibilityRequestDocumentStatus;
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
        Cell: ({ value }: any) => {
          if (value) {
            return formatDate(value);
          }
          return '';
        },
        width: '25%'
      },
      {
        Header: t<string>('documentTable.header.actions'),
        Cell: ({ row }: Cell<Document>) => (
          <>
            {row.original.status === 'PENDING' && (
              <em>Virus scan in progress...</em>
            )}
            {row.original.status === 'AVAILABLE' && (
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
                  {t('documentTable.view')}
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
            {row.original.status === 'UNAVAILABLE' && (
              <>
                <i className="fa fa-exclamation-circle text-secondary" />{' '}
                Document failed virus scan
              </>
            )}
          </>
        )
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data: documents,
    documents,
    initialState: {
      sortBy: [{ id: 'uploadedAt', desc: true }]
    }
  });

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
                  style={{ whiteSpace: 'nowrap', width: column.width }}
                  scope="col"
                >
                  {column.render('Header')}
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
