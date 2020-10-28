import React, { useEffect, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Table } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { convertIntakeToCSV } from 'data/systemIntake';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

const RequestRepository = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const dispatch = useDispatch();

  const columns: any = useMemo(
    () => [
      {
        Header: t('intake:fields.submissionDate'),
        accessor: 'submittedAt',
        Cell: ({ value }: any) => {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
        }
      },
      {
        Header: t('intake:fields.projectName'),
        accessor: 'requestName',
        Cell: ({ row, value }: any) => {
          return (
            <Link to={`/governance-review-team/${row.original.id}`}>
              {value}
            </Link>
          );
        }
      },
      {
        Header: t('intake:fields.component'),
        accessor: 'requester.component'
      },
      {
        Header: t('requestRepository.table.requestType'),
        accessor: 'type'
      }
    ],
    [t]
  );

  useEffect(() => {
    dispatch(fetchSystemIntakes());
  }, [dispatch]);

  const systemIntakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );

  const data = useMemo(() => systemIntakes, [systemIntakes]);

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
      initialState: {
        sortBy: [{ id: 'submittedAt', desc: true }]
      }
    },
    useSortBy
  );

  const getHeaderSortIcon = (isDesc: boolean | undefined) => {
    return classnames('margin-left-1', {
      'fa fa-caret-down': isDesc,
      'fa fa-caret-up': !isDesc
    });
  };

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

  const csvHeaders = [
    { key: 'euaUserID', label: t('intake:csvHeadings.euaId') },
    { key: 'requester.name', label: t('intake:csvHeadings.requesterName') },
    {
      key: 'requester.component',
      label: t('intake:csvHeadings.requesterComponent')
    },
    {
      key: 'businessOwner.name',
      label: t('intake:csvHeadings.businessOwnerName')
    },
    {
      key: 'businessOwner.component',
      label: t('intake:csvHeadings.businessOwnerComponent')
    },
    {
      key: 'productManager.name',
      label: t('intake:csvHeadings.productManagerName')
    },
    {
      key: 'productManager.component',
      label: t('intake:csvHeadings.productManagerComponent')
    },
    {
      key: 'isso.name',
      label: t('intake:csvHeadings.isso')
    },
    {
      key: 'trbCollaborator',
      label: t('intake:csvHeadings.trbCollaborator')
    },
    {
      key: 'oitCollaborator',
      label: t('intake:csvHeadings.oitCollaborator')
    },
    {
      key: 'eaCollaborator',
      label: t('intake:csvHeadings.eaCollaborator')
    },
    {
      key: 'requestName',
      label: t('intake:csvHeadings.projectName')
    },
    {
      key: 'fundingSource.isFunded',
      label: t('intake:csvHeadings.existingFunding')
    },
    {
      key: 'fundingSource.source',
      label: t('intake:csvHeadings.fundingSource')
    },
    {
      key: 'fundingSource.fundingNumber',
      label: t('intake:csvHeadings.fundingNumber')
    },
    {
      key: 'businessNeed',
      label: t('intake:csvHeadings.businessNeed')
    },
    {
      key: 'businessSolution',
      label: t('intake:csvHeadings.businessSolution')
    },
    {
      key: 'currentStage',
      label: t('intake:csvHeadings.currentStage')
    },
    {
      key: 'needsEaSupport',
      label: t('intake:csvHeadings.eaSupport')
    },
    {
      key: 'costs.isExpectingIncrease',
      label: t('intake:csvHeadings.isExpectingCostIncrease')
    },
    {
      key: 'costs.expectedIncreaseAmount',
      label: t('intake:csvHeadings.expectedIncreaseAmount')
    },
    {
      key: 'contract.hasContract',
      label: t('intake:csvHeadings.existingContract')
    },
    {
      key: 'contract.contractor',
      label: t('intake:csvHeadings.contractors')
    },
    {
      key: 'contract.vehicle',
      label: t('intake:csvHeadings.contractVehicle')
    },
    {
      key: 'contractStartDate',
      label: t('intake:csvHeadings.contractStart')
    },
    {
      key: 'contractEndDate',
      label: t('intake:csvHeadings.contractEnd')
    },
    {
      key: 'status',
      label: t('intake:csvHeadings.status')
    },
    {
      key: 'updatedAt',
      label: t('intake:csvHeadings.updatedAt')
    },
    {
      key: 'submittedAt',
      label: t('intake:csvHeadings.submittedAt')
    },
    {
      key: 'createdAt',
      label: t('intake:csvHeadings.createdAt')
    },
    {
      key: 'decidedAt',
      label: t('intake:csvHeadings.decidedAt')
    },
    {
      key: 'archivedAt',
      label: t('intake:csvHeadings.archivedAt')
    }
  ];

  const convertIntakesToCSV = (intakes: SystemIntakeForm[]) => {
    return intakes.map(intake => convertIntakeToCSV(intake));
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container">
        <div className="display-flex flex-justify flex-wrap margin-y-2">
          <BreadcrumbNav>
            <li>
              <Link to="/">Home</Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>Requests</li>
          </BreadcrumbNav>
          <div>
            <CSVLink
              data={convertIntakesToCSV(data)}
              filename="request-repository.csv"
              headers={csvHeaders}
            >
              <i className="fa fa-download" />
            </CSVLink>
            &nbsp;
            <CSVLink
              data={convertIntakesToCSV(data)}
              filename="request-repository.csv"
              headers={csvHeaders}
            >
              Download all requests as excel file
            </CSVLink>
          </div>
        </div>
        <h1>{t('requestRepository.header')}</h1>
        <p>{t('requestRepository.requestCount', { count: data.length })}</p>
        <Table bordered={false} {...getTableProps()} fullWidth>
          <caption className="usa-sr-only">
            {t('requestRepository.aria.openRequestsTable')}
          </caption>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    aria-sort={getColumnSortStatus(column)}
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
      <Footer />
    </PageWrapper>
  );
};

export default RequestRepository;
