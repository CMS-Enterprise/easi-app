import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import {
  Alert,
  Button,
  ErrorMessage,
  Fieldset,
  FileInput,
  Form,
  FormGroup,
  IconArrowBack,
  Radio,
  Table
} from '@trussworks/react-uswds';

import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Documents({ request, stepUrl, taskListUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const columns = useMemo(() => {
    return [
      {
        Header: t<string>('documents.table.header.fileName'),
        accessor: 'a'
      },
      {
        Header: t<string>('documents.table.header.documentType'),
        accessor: 'b'
      },
      {
        Header: t<string>('documents.table.header.uploadDate'),
        accessor: 'c'
      },
      {
        Header: t<string>('documents.table.header.actions'),
        accessor: 'd'
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
      data: [],
      autoResetSortBy: false,
      autoResetPage: false
    },
    useSortBy
  );

  const { control } = useForm({
    defaultValues: {
      documentType: ''
    }
  });

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
        <Form className="maxw-full" onSubmit={e => e.preventDefault()}>
          {/* tablet col 6 */}
          <h1>{t('documents.upload.title')}</h1>
          <div>{t('documents.upload.subtitle')}</div>
          <div>
            <h4>{t('documents.upload.documentUpload')}</h4>
            <FileInput id="file-input-single" name="file-input-single" />
          </div>
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
                    id="documentType"
                    label={t('documents.upload.type.ARCHITECTURE_DIAGRAM')}
                    value=""
                  />
                </Fieldset>
              </FormGroup>
            )}
          />
          {/* other text */}
          <Alert type="info" slim>
            {t('documents.upload.toKeepCmsSafe')}
          </Alert>
        </Form>
        <div>
          <Button type="button">{t('documents.upload.uploadDocument')}</Button>
        </div>
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
