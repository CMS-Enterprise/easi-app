import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column, useSortBy, useTable } from 'react-table';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Alert, Button, Table } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Spinner from 'components/Spinner';
import useCacheQuery from 'hooks/useCacheQuery';
import DeleteTrbRequestDocumentQuery from 'queries/DeleteTrbRequestDocumentQuery';
import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import GetTrbRequestDocumentUrlsQuery from 'queries/GetTrbRequestDocumentUrlsQuery';
import {
  DeleteTrbRequestDocument,
  DeleteTrbRequestDocumentVariables
} from 'queries/types/DeleteTrbRequestDocument';
import {
  GetTrbRequestDocuments,
  GetTrbRequestDocuments_trbRequest_documents as TrbRequestDocuments,
  GetTrbRequestDocumentsVariables
} from 'queries/types/GetTrbRequestDocuments';
import { GetTrbRequestDocumentUrls } from 'queries/types/GetTrbRequestDocumentUrls';
import {
  TRBDocumentCommonType,
  TRBRequestDocumentStatus
} from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import { downloadFileFromURLOnly } from 'utils/downloadFile';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

import { DocumentStatusType } from '../TrbDocuments';

import { RefetchDocuments } from './Documents';

type Props = {
  trbRequestId: string;
  setRefetchDocuments?: React.Dispatch<React.SetStateAction<RefetchDocuments>>;
  setLoadingDocuments?: React.Dispatch<React.SetStateAction<boolean>>;
  setDocumentsCount?: React.Dispatch<React.SetStateAction<number>>;
  setDocumentMessage?: (value: string) => void;
  setDocumentStatus?: (value: DocumentStatusType) => void;
  canEdit?: boolean;
};

function DocumentsTable({
  trbRequestId,
  setRefetchDocuments,
  setLoadingDocuments,
  setDocumentsCount,
  setDocumentMessage,
  setDocumentStatus,
  canEdit = true
}: Props) {
  const { t } = useTranslation('technicalAssistance');

  const [isModalOpen, setModalOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState<TrbRequestDocuments>(
    {} as TrbRequestDocuments
  );

  const { data, refetch, loading } = useCacheQuery<
    GetTrbRequestDocuments,
    GetTrbRequestDocumentsVariables
  >(GetTrbRequestDocumentsQuery, {
    variables: { id: trbRequestId }
  });

  const [
    getDocumentUrls,
    { data: urlData, loading: urlLoading, error: urlError, called: urlCalled }
  ] = useLazyQuery<GetTrbRequestDocumentUrls, GetTrbRequestDocumentsVariables>(
    GetTrbRequestDocumentUrlsQuery,
    {
      variables: {
        id: trbRequestId
      }
    }
  );

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

  const setRemoveError = useMemo(() => {
    return () => {
      if (setDocumentMessage && setDocumentStatus) {
        setDocumentMessage(t('documents.supportingDocuments.removeFail'));
        setDocumentStatus('error');
      }
    };
  }, [t, setDocumentMessage, setDocumentStatus]);

  const handleDelete = useMemo(() => {
    return (file: TrbRequestDocuments) => {
      deleteDocument({
        variables: {
          id: file.id
        }
      })
        .then(response => {
          if (!response.errors) {
            if (setDocumentMessage && setDocumentStatus) {
              setDocumentMessage(
                t('documents.supportingDocuments.removeSuccess', {
                  documentName: file.fileName
                })
              );
              setDocumentStatus('success');
            }
            refetch();
          } else {
            setRemoveError();
          }
        })
        .catch(() => {
          setRemoveError();
        });
    };
  }, [
    deleteDocument,
    refetch,
    t,
    setDocumentMessage,
    setDocumentStatus,
    setRemoveError
  ]);

  const columns = useMemo<Column<TrbRequestDocuments>[]>(() => {
    const getUrlForDocument = (documentId: string) => {
      // use as promise instead of relying on urlLoading, urlError, urlData, etc.
      // when using those, had an issue where the first click wouldn't log response data; urlLoading and urlError were false, but urlData was falsy
      getDocumentUrls()
        .then(response => {
          if (response.error) {
            // TODO - handle error
          } else if (response.loading) {
            // TODO - handle case where it's still loading
          } else if (!response.data) {
            // TODO - handle not returning any data
          } else {
            // Download document

            const requestedDocument = response.data.trbRequest.documents.find(
              doc => doc.id === documentId
            )!; // non-null assertion should be safe, this function should only be called with a documentId of a valid document
            downloadFileFromURLOnly(requestedDocument.url);
          }
        })
        .catch(() => {
          // TODO - error handling
        });
    };

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
        Cell: ({ value }) => formatDateLocal(value, 'MM/dd/yyyy')
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
            return <em>{t('documents.table.virusScan')}</em>;
          // View or Remove
          if (row.original.status === TRBRequestDocumentStatus.AVAILABLE) {
            const documentId = row.original.id;
            // return (
            //   <Link
            //     target="_blank"
            //     href="#"

            //   >
            //     {t('documents.table.view')}
            //   </Link>
            // );

            // Show some file actions once it's available
            let viewButtonText = t('documents.table.view');
            if (urlCalled) {
              if (urlLoading) {
                viewButtonText = 'Loading...';
              } else if (urlError) {
                viewButtonText = 'Error!';
              } else if (!urlData) {
                viewButtonText = 'No URL data!';
              }
            }

            return (
              <>
                {/* View document */}
                <Button
                  type="button"
                  unstyled
                  onClick={() => getUrlForDocument(documentId)}
                >
                  {viewButtonText}
                </Button>
                {/* Delete document */}
                {canEdit && (
                  <Button
                    unstyled
                    type="button"
                    className="margin-left-2 text-error"
                    onClick={() => {
                      setModalOpen(true);
                      setFileToRemove(row.original);
                    }}
                  >
                    {t('documents.table.remove')}
                  </Button>
                )}
              </>
            );
          }
          // Infected unavailable
          if (row.original.status === TRBRequestDocumentStatus.UNAVAILABLE)
            return t('documents.table.unavailable');
          return '';
        }
      }
    ];
  }, [t, getDocumentUrls, urlCalled, urlLoading, urlError, urlData, canEdit]);

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

  const renderModal = () => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-0">
          {t('documents.supportingDocuments.removeHeading', {
            documentName: fileToRemove.fileName
          })}
        </PageHeading>

        <p>{t('documents.supportingDocuments.removeInfo')}</p>

        <Button
          type="button"
          onClick={() => {
            handleDelete(fileToRemove);
            setModalOpen(false);
          }}
        >
          {t('documents.supportingDocuments.removeDocument')}
        </Button>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => setModalOpen(false)}
        >
          {t('documents.supportingDocuments.cancel')}
        </Button>
      </Modal>
    );
  };

  return (
    <div className="easi-table--bleed-x easi-table--bottomless">
      {renderModal()}
      {data && documents.length ? (
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
        <Alert type="info" slim>
          {t('documents.table.noDocuments')}
        </Alert>
      )}
    </div>
  );
}

export default DocumentsTable;
