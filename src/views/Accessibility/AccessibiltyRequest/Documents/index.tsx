import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';
// import { useTable } from 'react-table';
import { DateTime } from 'luxon';

type Document = {
  name: string;
  uploadedAt: string;
};

type DocumentsListProps = {
  documents: Document[];
};

const AccessibilityDocumentsList = ({ documents }: DocumentsListProps) => {
  const { t } = useTranslation('accessibility');

  const columns: any = useMemo(() => {
    return [
      {
        Header: t('documentTable.header.documentName'),
        accessor: 'name'
      },
      {
        Header: t('documentTable.header.uploadedAt'),
        accessor: 'uploadedAt',
        Cell: ({ value }: any) => {
          if (value) {
            return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
          }
          return '';
        }
      },
      {
        Header: t('documentTable.header.actions'),
        Cell: ({ row }: any) => (
          <>
            <UswdsLink
              asCustom={Link}
              to={`/some-508-request/${row.original.name}`}
            >
              {t('documentTable.view')}
            </UswdsLink>
            {/* eslint-disable-next-line prettier/prettier */}
            { }
            <UswdsLink
              asCustom={Link}
              to={`/some-508-request/${row.original.name}`}
            >
              {t('documentTable.remove')}
            </UswdsLink>
          </>
        )
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(columns);

  if (documents.length === 0) {
    return <span>{t('requestDetails.documents.none')}</span>;
  }
  return <p>{JSON.stringify(documents)}</p>;
};

export default AccessibilityDocumentsList;
