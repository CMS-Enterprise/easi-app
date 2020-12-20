import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSortBy, useTable } from 'react-table';
import { Button, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import Label from 'components/shared/Label';
import { AppState } from 'reducers/rootReducer';
import { FileUploadForm } from 'types/files';
import { getFileS3, postFileUploadURL, putFileS3 } from 'types/routines';
import { uploadSchema } from 'validations/fileSchema';

const DocumentPrototype = () => {
  const { t } = useTranslation('action');
  const dispatch = useDispatch();

  type TableTypes = 'empty' | 'files';
  const [activeTable, setActiveTable] = useState<TableTypes>('empty');

  const fileState = useSelector((state: AppState) => state.files);

  const dispatchUpload = () => {
    dispatch(
      putFileS3({
        ...fileState.form
      })
    );

    setActiveTable('files');
  };
  const downloadFile = event => {
    const filename = event.target.value;
    dispatch(
      getFileS3({
        filename
      })
    );
  };

  const filenameColumn = {
    Header: t('filename'),
    accessor: 'filename'
  };

  const fileURLColumn = {
    Header: t('uploadURL'),
    accessor: 'uploadURL'
  };

  const fileDownloadColumn = {
    Header: t('download'),
    accessor: 'downloadURL',
    Cell: ({ row }: any) => {
      return (
        <Button
          type="submit"
          value={row.original.filename}
          onClick={downloadFile}
        >
          Download
        </Button>
      );
    }
  };

  const columns: any = useMemo(() => {
    if (activeTable === 'files') {
      return [filenameColumn, fileURLColumn, fileDownloadColumn];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTable]);

  const data = useMemo(() => {
    return fileState.files.map(file => {
      return {
        ...file
      };
    });
  }, [fileState.files]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      sortTypes: {
        // TODO: This may not work if another column is added that is not a string or date.
        // Sort method changes depending on if item is a string or object
        alphanumeric: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          const rowTwoElem = rowTwo.values[columnName];

          // If item is a string, enforce capitalization (temporarily) and then compare
          if (typeof rowOneElem === 'string') {
            return rowOneElem.toUpperCase() > rowTwoElem.toUpperCase() ? 1 : -1;
          }

          // If item is a DateTime, convert to Number and compare
          if (rowOneElem instanceof DateTime) {
            return Number(rowOneElem) > Number(rowTwoElem) ? 1 : -1;
          }

          // If neither string nor DateTime, return bare comparison
          return rowOneElem > rowTwoElem ? 1 : -1;
        }
      },
      data
    },
    useSortBy
  );

  const getColumnSortStatus = (
    column: any
  ): 'descending' | 'ascending' | 'none' => {
    if (column.isSorted) {
      if (column.isSortedDesc) {
        return 'descending';
      }
      return 'ascending';
    }

    return 'none';
  };

  const getHeaderSortIcon = (isDesc: boolean | undefined) => {
    return classnames('margin-left-1', {
      'fa fa-caret-down': isDesc,
      'fa fa-caret-up': !isDesc
    });
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <PageWrapper className="system-intake">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <h1>Document Prototype</h1>
        <Formik
          initialValues={{
            filename: '',
            file: {} as File,
            uploadURL: ''
          }}
          onSubmit={dispatchUpload}
          validationSchema={uploadSchema}
        >
          {(formikProps: FormikProps<FileUploadForm>) => {
            return (
              <Form onSubmit={formikProps.handleSubmit}>
                <div className="form-group">
                  <Label htmlFor="file">File upload</Label>
                  <input
                    id="file-input-specific"
                    name="file"
                    type="file"
                    onChange={event => {
                      formikProps.setFieldValue(
                        'file',
                        event.currentTarget.files[0]
                      );

                      dispatch(
                        postFileUploadURL({
                          ...fileState.form,
                          file: event.currentTarget.files[0]
                        })
                      );
                    }}
                    className="form-control"
                  />
                </div>
                <Button type="submit" className="btn btn-primary">
                  {t('uploadFile.submit')}
                </Button>
              </Form>
            );
          }}
        </Formik>

        <Table bordered={false} {...getTableProps()} fullWidth>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    aria-sort={getColumnSortStatus(column)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {column.render('Header')}
                    {column.isSorted && (
                      <span
                        className={getHeaderSortIcon(column.isSortedDesc)}
                      />
                    )}
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
                        <th {...cell.getCellProps()} scope="row">
                          {cell.render('Cell')}
                        </th>
                      );
                    }
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </MainContent>
    </PageWrapper>
  );
};

export default DocumentPrototype;
