import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import { useMutation } from '@apollo/client';
import { Button, Link, Table } from '@trussworks/react-uswds';
import { DeleteAccessibilityRequestDocumentQuery } from 'queries/AccessibilityRequestDocumentQueries';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  DeleteAccessibilityRequestDocument,
  DeleteAccessibilityRequestDocumentVariables
} from 'queries/types/DeleteAccessibilityRequestDocument';
import {
  GetAccessibilityRequest,
  GetAccessibilityRequestVariables
} from 'queries/types/GetAccessibilityRequest';

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
  requestId: string;
};

const AccessibilityDocumentsList = ({
  documents,
  requestName,
  requestId
}: DocumentsListProps) => {
  const { t } = useTranslation('accessibility');
  const [isModalOpen, setModalOpen] = useState(false);

  const getDocType = (documentType: {
    commonType: AccessibilityRequestDocumentCommonType;
    otherTypeDescription: string | null;
  }) => {
    if (documentType.commonType !== 'OTHER') {
      return translateDocumentType(
        documentType.commonType as AccessibilityRequestDocumentCommonType
      );
    }
    return documentType.otherTypeDescription || '';
  };

  const [mutate] = useMutation<
    DeleteAccessibilityRequestDocument,
    DeleteAccessibilityRequestDocumentVariables
  >(DeleteAccessibilityRequestDocumentQuery);

  const submitDelete = (id: string) => {
    mutate({
      variables: {
        input: {
          id
        }
      },
      update(cache) {
        const cachedAccessibilityRequest = cache.readQuery<
          GetAccessibilityRequest,
          GetAccessibilityRequestVariables
        >({
          query: GetAccessibilityRequestQuery,
          variables: { id: requestId }
        });
        if (cachedAccessibilityRequest?.accessibilityRequest?.documents) {
          cache.writeQuery<
            GetAccessibilityRequest,
            GetAccessibilityRequestVariables
          >({
            query: GetAccessibilityRequestQuery,
            data: {
              ...cachedAccessibilityRequest,
              accessibilityRequest: {
                ...cachedAccessibilityRequest.accessibilityRequest,
                documents: cachedAccessibilityRequest.accessibilityRequest.documents.filter(
                  document => document.id !== id
                )
              }
            }
          });
        }
      }
    });
    setModalOpen(false);
  };

  const columns: any = useMemo(() => {
    return [
      {
        Header: t('documentTable.header.documentName'),
        accessor: 'documentType',
        Cell: ({ value }: any) => getDocType(value)
      },
      {
        Header: t('documentTable.header.uploadedAt'),
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
        Header: t('documentTable.header.actions'),
        Cell: ({ row }: any) => (
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
                  aria-label={`View ${getDocType(
                    row.original.documentType
                  )} in a new tab or window`}
                >
                  {t('documentTable.view')}
                </Link>
                <Button
                  aria-label={`Remove ${getDocType(row.original.documentType)}`}
                  type="button"
                  unstyled
                  onClick={() => setModalOpen(true)}
                >
                  {t('documentTable.remove')}
                </Button>
                <Modal
                  isOpen={isModalOpen}
                  closeModal={() => setModalOpen(false)}
                >
                  <PageHeading
                    headingLevel="h1"
                    className="line-height-heading-2 margin-bottom-2"
                  >
                    {t('documentTable.modal.header', {
                      name: getDocType(row.original.documentType)
                    })}
                  </PageHeading>
                  <span>{t('documentTable.modal.warning')}</span>
                  <div className="display-flex margin-top-2">
                    <Button
                      type="button"
                      className="margin-right-5"
                      onClick={() => submitDelete(row.original.id)}
                    >
                      {t('documentTable.modal.proceedButton')}
                    </Button>
                    <Button
                      type="button"
                      unstyled
                      onClick={() => setModalOpen(false)}
                    >
                      {t('documentTable.modal.declineButton')}
                    </Button>
                  </div>
                </Modal>
              </>
            )}
            {row.original.status === 'UNAVAILABLE' && (
              <>
                <i className="fa fa-exclamation-circle text-secondary" />{' '}
                Document failed virus scan
              </>
            )}
            {/* <UswdsLink asCustom={Link} to="#" className="margin-left-2">
              {t('documentTable.remove')}
            </UswdsLink>
            <span className="usa-sr-only">{row.original.name}</span> */}
          </>
        )
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

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
    return <span>{t('requestDetails.documents.none')}</span>;
  }

  return (
    <>
      <Table bordered={false} {...getTableProps()} fullWidth>
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
              <tr {...row.getRowProps()}>
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
    </>
  );
};

export default AccessibilityDocumentsList;
