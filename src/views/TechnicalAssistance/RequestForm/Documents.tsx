import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { CellProps, Column, useSortBy, useTable } from 'react-table';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  ErrorMessage,
  Fieldset,
  FileInput,
  Form,
  FormGroup,
  Grid,
  IconArrowBack,
  Label,
  Link,
  Radio,
  Table,
  TextInput
} from '@trussworks/react-uswds';
import { pickBy } from 'lodash';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import CreateTrbRequestDocumentQuery from 'queries/CreateTrbRequestDocumentQuery';
import DeleteTrbRequestDocumentQuery from 'queries/DeleteTrbRequestDocumentQuery';
import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import {
  CreateTrbRequestDocument,
  CreateTrbRequestDocumentVariables
} from 'queries/types/CreateTrbRequestDocument';
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
import {
  documentSchema,
  TrbRequestInputDocument
} from 'validations/trbRequestSchema';

import Breadcrumbs from '../Breadcrumbs';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

/**
 * Documents is a component of both the table list of uploaded documents
 * and the document upload form.
 */
function Documents({
  request,
  stepUrl,
  taskListUrl,
  setFormAlert
}: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();
  const { url } = useRouteMatch();

  const { view } = useParams<{
    view?: string;
  }>();

  const { data, refetch /* , error, loading */ } = useQuery<
    GetTrbRequestDocuments,
    GetTrbRequestDocumentsVariables
  >(GetTrbRequestDocumentsQuery, {
    variables: { id: request.id }
  });

  // console.log('loading', loading, 'error', error);
  // console.log('data', data);

  const documents = data?.trbRequest.documents || [];
  // console.log('documents', documents);

  // Documents can be created from the upload form
  const [createDocument /* , createResult */] = useMutation<
    CreateTrbRequestDocument,
    CreateTrbRequestDocumentVariables
  >(CreateTrbRequestDocumentQuery);

  const [isUploadError, setIsUploadError] = useState(false);

  useEffect(() => {
    if (view === 'upload') setFormAlert(false);
    if (!view) setIsUploadError(false);
  }, [view, t, setFormAlert]);

  // Documents can be deleted from the table
  const [deleteDocument /* , deleteResult */] = useMutation<
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
            return <em>{t('documents.table.virusScan')}</em>;
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

  const {
    control,
    handleSubmit,
    watch,
    formState: { /* errors, */ isSubmitting, isDirty }
  } = useForm<TrbRequestInputDocument>({
    resolver: yupResolver(documentSchema),
    defaultValues: {
      documentType: undefined,
      fileData: undefined,
      otherTypeDescription: ''
    }
  });

  const submit = handleSubmit(async formData => {
    // console.log('formdata', formData);

    // Filter out otherTypeDescription input if it's empty
    const input: any = pickBy(formData, v => v !== '');

    createDocument({
      variables: {
        input: {
          requestID: request.id,
          ...input
        }
      }
    })
      .then(() => {
        refetch(); // Reload documents
        // todo need to update alert params for success state
        // setFormAlert({
        //   type: 'success',
        //   message: t('documents.upload.success')
        // });
        // Go back to the documents step
        history.push(`/trb/requests/${request.id}/documents`);
      })
      .catch(err => {
        // console.log(err);
        setIsUploadError(true);
      });
  });

  // console.log('values', JSON.stringify(watch(), null, 2));
  // console.log('errors', JSON.stringify(errors, null, 2));
  // console.log('isDirty', isDirty);
  // console.log('dirtyFields', JSON.stringify(dirtyFields, null, 2));

  return (
    <Switch>
      {/* Documents table */}
      <Route exact path="/trb/requests/:id/documents">
        {/* Open the document upload form */}
        <div>
          <UswdsReactLink
            variant="unstyled"
            className="usa-button"
            to={`${url}/upload`}
          >
            {t('documents.addDocument')}
          </UswdsReactLink>
        </div>

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
            <div>{t('documents.table.noDocument')}</div>
          )}
        </div>

        <Pager
          back={{
            onClick: () => {
              history.push(stepUrl.back);
            }
          }}
          next={{
            onClick: e => {
              history.push(stepUrl.next);
            },
            text: t(
              documents.length
                ? 'button.next'
                : 'documents.continueWithoutAdding'
            ),
            outline: documents.length === 0
          }}
          taskListUrl={taskListUrl}
        />
      </Route>

      {/* Upload document form */}
      <Route exact path="/trb/requests/:id/documents/upload">
        <div>
          <Breadcrumbs
            items={[
              { text: t('heading'), url: '/trb' },
              {
                text: t('taskList.heading'),
                url: taskListUrl
              },
              {
                text: t('requestForm.heading'),
                url: `/trb/requests/${request.id}/documents`
              },
              { text: t('documents.upload.title') }
            ]}
          />
          {isUploadError && (
            <Alert type="error" slim>
              {t('documents.upload.error')}
            </Alert>
          )}
          <Form className="maxw-full" onSubmit={submit}>
            <h1>{t('documents.upload.title')}</h1>
            <Grid row gap>
              <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                <div>{t('documents.upload.subtitle')}</div>
                <Controller
                  name="fileData"
                  control={control}
                  // eslint-disable-next-line no-shadow
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <FormGroup error={!!error}>
                        <Label htmlFor={field.name} error={!!error}>
                          {t('documents.upload.documentUpload')}
                        </Label>
                        {error && (
                          <ErrorMessage>{t('errors.selectFile')}</ErrorMessage>
                        )}
                        <FileInput
                          id={field.name}
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={e => {
                            field.onChange(e.currentTarget?.files?.[0]);
                          }}
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                        />
                      </FormGroup>
                    );
                  }}
                />
                <Controller
                  name="documentType"
                  control={control}
                  // eslint-disable-next-line no-shadow
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup error={!!error}>
                      <Fieldset legend={t('documents.upload.whatType')}>
                        {error && (
                          <ErrorMessage>
                            {t('errors.makeSelection')}
                          </ErrorMessage>
                        )}
                        {[
                          'ARCHITECTURE_DIAGRAM',
                          'PRESENTATION_SLIDE_DECK',
                          'BUSINESS_CASE',
                          'OTHER'
                        ].map(val => (
                          <Radio
                            key={val}
                            id={`${field.name}-${val}`}
                            data-testid={`${field.name}-${val}`}
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            label={t(`documents.upload.type.${val}`)}
                            value={val}
                          />
                        ))}
                      </Fieldset>
                    </FormGroup>
                  )}
                />
                {watch('documentType') === 'OTHER' && (
                  <div className="margin-left-4">
                    <Controller
                      name="otherTypeDescription"
                      control={control}
                      // eslint-disable-next-line no-shadow
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup>
                          <Label htmlFor={field.name} error={!!error}>
                            {t('documents.upload.whatKind')}
                          </Label>
                          {error && (
                            <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                          )}
                          <TextInput
                            id={field.name}
                            name={field.name}
                            type="text"
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            value={field.value || ''}
                            validationStatus={error && 'error'}
                          />
                        </FormGroup>
                      )}
                    />
                  </div>
                )}
                <Alert type="info" slim>
                  {t('documents.upload.toKeepCmsSafe')}
                </Alert>
              </Grid>
            </Grid>
            <div>
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {t('documents.upload.uploadDocument')}
              </Button>
            </div>
          </Form>
          <div>
            <UswdsReactLink
              variant="unstyled"
              to={`/trb/requests/${request.id}/documents`}
            >
              <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
              {t('documents.upload.dontUploadAndReturn')}
            </UswdsReactLink>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default Documents;
