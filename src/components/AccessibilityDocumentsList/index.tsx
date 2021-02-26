import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import { Link, Table } from '@trussworks/react-uswds';

import {
  AccessibilityRequestDocumentCommonType,
  AccessibilityRequestDocumentStatus
} from 'types/graphql-global-types';
import { translateDocumentType } from 'utils/accessibilityRequest';
import formatDate from 'utils/formatDate';

type Document = {
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
};

const AccessibilityDocumentsList = ({
  documents,
  requestName
}: DocumentsListProps) => {
  const { t } = useTranslation('accessibility');

  const getDocType = (documentType: {
    commonType: AccessibilityRequestDocumentCommonType;
    otherTypeDescription: string;
  }) => {
    if (documentType.commonType !== 'OTHER') {
      return translateDocumentType(
        documentType.commonType as AccessibilityRequestDocumentCommonType
      );
    }
    return documentType.otherTypeDescription;
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
              <Link
                target="_blank"
                rel="noreferrer"
                href={row.original.url}
                aria-label={`View ${getDocType(
                  row.original.documentType
                )} in a new tab or window`}
              >
                {t('documentTable.view')}
              </Link>
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
    return <span>{t('requestDetails.documents.none')}</span>;
  }

  return (
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
  );
};

export default AccessibilityDocumentsList;
