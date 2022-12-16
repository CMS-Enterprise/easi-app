import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Column, useSortBy, useTable } from 'react-table';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  ErrorMessage,
  Fieldset,
  FileInput,
  Form,
  FormGroup,
  IconArrowBack,
  Label,
  Radio,
  Table
} from '@trussworks/react-uswds';

import CreateTrbRequestDocumentQuery from 'queries/CreateTrbRequestDocumentQuery';
import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import {
  CreateTrbRequestDocument,
  CreateTrbRequestDocumentVariables
} from 'queries/types/CreateTrbRequestDocument';
import {
  GetTrbRequestDocuments,
  GetTrbRequestDocuments_trbRequest_documents as TrbRequestDocuments,
  GetTrbRequestDocumentsVariables
} from 'queries/types/GetTrbRequestDocuments';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Documents({ request, stepUrl, taskListUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const { data /* error, loading */ } = useQuery<
    GetTrbRequestDocuments,
    GetTrbRequestDocumentsVariables
  >(GetTrbRequestDocumentsQuery, {
    variables: { id: request.id }
  });
  const documents = data?.trbRequest.documents || [];

  const columns = useMemo<Column<TrbRequestDocuments>[]>(() => {
    return [
      {
        Header: t<string>('documents.table.header.fileName'),
        accessor: 'fileName'
      },
      {
        Header: t<string>('documents.table.header.documentType'),
        accessor: 'documentType.commonType' // todo other & ts error
      },
      {
        Header: t<string>('documents.table.header.uploadDate'),
        accessor: 'uploadedAt'
      },
      {
        Header: t<string>('documents.table.header.actions'),
        accessor: 'url'
      }
    ];
  }, [t]);

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
      autoResetPage: false
    },
    useSortBy
  );

  const [createDocument] = useMutation<
    CreateTrbRequestDocument,
    CreateTrbRequestDocumentVariables
  >(CreateTrbRequestDocumentQuery);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      documentType: '',
      fileData: undefined
    }
  });

  const submit = async (formData: any) => {
    // console.log('formdata', formData);

    await createDocument({
      variables: {
        input: {
          requestID: request.id,
          ...formData
        }
      }
    });
  };

  // console.log('values', JSON.stringify(watch(), null, 2));

  return (
    <>
      <div>
        <Button type="button">{t('documents.addDocument')}</Button>
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
        <div>{t('documents.table.noDocument')}</div>
      </div>
      <div>
        <Form className="maxw-full" onSubmit={handleSubmit(submit)}>
          {/* tablet col 6 */}
          <h1>{t('documents.upload.title')}</h1>
          <div>{t('documents.upload.subtitle')}</div>
          <Controller
            name="fileData"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup error={!!error}>
                  <Label htmlFor={field.name} error={!!error}>
                    {t('documents.upload.documentUpload')}
                  </Label>
                  {error && <ErrorMessage>todo</ErrorMessage>}
                  <FileInput
                    {...field}
                    ref={null}
                    id={field.name}
                    onChange={e => {
                      field.onChange(e.currentTarget?.files?.[0]);
                    }}
                    value=""
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                </FormGroup>
              );
            }}
          />
          <Controller
            name="documentType"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Fieldset legend={t('documents.upload.whatType')}>
                  {error && (
                    <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                  )}
                  <Radio
                    {...field}
                    ref={null}
                    id={field.name}
                    label={t('documents.upload.type.ARCHITECTURE_DIAGRAM')}
                    value="ARCHITECTURE_DIAGRAM"
                  />
                </Fieldset>
              </FormGroup>
            )}
          />
          {/* other text */}
          <Alert type="info" slim>
            {t('documents.upload.toKeepCmsSafe')}
          </Alert>
          <div>
            <Button type="submit">
              {t('documents.upload.uploadDocument')}
            </Button>
          </div>
        </Form>
        <div>
          <Button type="button" unstyled>
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('documents.upload.dontUploadAndReturn')}
          </Button>
        </div>
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
          text: t('documents.continueWithoutAdding'),
          outline: true
        }}
        taskListUrl={taskListUrl}
      />
    </>
  );
}

export default Documents;
