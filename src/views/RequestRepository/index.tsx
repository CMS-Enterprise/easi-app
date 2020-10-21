import React, { useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
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
import {
  convertIntakesToCSV,
  initialSystemIntakeForm
} from 'data/systemIntake';
import { SystemIntakeForm } from 'types/systemIntake';

const RequestRepository = () => {
  const { t } = useTranslation('governanceReviewTeam');
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

  // Mock Data
  // EASI-789 will create an endpoint for getting all intake requests for GRT
  const mockData: SystemIntakeForm[] = [
    {
      ...initialSystemIntakeForm,
      id: 'addaa218-34d3-4dd8-a12f-38f6ff33b22d',
      euaUserID: 'ABCD',
      submittedAt: DateTime.fromObject({ year: 2020, month: 6, day: 26 }),
      requestName: 'Easy Access to System Information',
      requester: {
        name: 'Christopher Hui',
        component: 'Division of Pop Corners',
        email: ''
      },
      businessOwner: {
        name: 'Business Owner 1',
        component: 'Office of Information Technology'
      },
      productManager: {
        name: 'Product Manager 1',
        component: 'Office of Information Technology'
      },
      isso: {
        isPresent: true,
        name: 'John ISSO'
      },
      governanceTeams: {
        isPresent: true,
        teams: [
          {
            name: 'Technical Review Board',
            collaborator: 'Chris TRB'
          },
          {
            name: "OIT's Security and Privacy Group",
            collaborator: 'Sam OIT Security'
          },
          {
            name: 'Enterprise Architecture',
            collaborator: 'Todd EA'
          }
        ]
      },
      fundingSource: {
        isFunded: true,
        fundingNumber: '123456'
      },
      costs: {
        isExpectingIncrease: 'YES',
        expectedIncreaseAmount: 'One million'
      },
      contract: {
        hasContract: 'IN_PROGRESS',
        contractor: 'TrussWorks, Inc.',
        vehicle: 'Fixed price contract',
        startDate: {
          month: '1',
          year: '2015'
        },
        endDate: {
          month: '12',
          year: '2021'
        }
      },
      businessNeed: 'Test business need',
      businessSolution: 'Test business solution',
      currentStage: 'Test current stage',
      needsEaSupport: true,
      status: 'Submitted',
      decidedAt: DateTime.fromObject({ year: 2020, month: 6, day: 27 }),
      createdAt: DateTime.fromObject({ year: 2020, month: 6, day: 22 }),
      updatedAt: DateTime.fromObject({ year: 2020, month: 6, day: 23 }),
      archivedAt: DateTime.fromObject({ year: 2020, month: 6, day: 28 })
    },
    {
      ...initialSystemIntakeForm,
      id: '229f9b64-18fc-4ee1-95c4-9d4b143d215c',
      euaUserID: 'ABCD',
      submittedAt: DateTime.fromObject({ year: 2020, month: 9, day: 19 }),
      requestName: 'Hard Access to System Information',
      requester: {
        name: 'George Baukerton',
        component: 'Office of Information Technology',
        email: ''
      },
      businessOwner: {
        name: 'Business Owner 2',
        component: 'Office of Information Technology'
      },
      productManager: {
        name: 'Product Manager 2',
        component: 'Office of Information Technology'
      },
      status: 'Submitted'
    },
    {
      ...initialSystemIntakeForm,
      id: '229f9b64-18fc-4ee1-95c4-9d4b143d215d',
      euaUserID: 'ABCD',
      submittedAt: DateTime.fromObject({ year: 2020, month: 10, day: 20 }),
      requestName: 'Super System',
      requester: {
        name: 'George Baukerton',
        component: 'Office of Information Technology',
        email: ''
      },
      businessOwner: {
        name: 'Business Owner 3',
        component: 'Office of Information Technology'
      },
      productManager: {
        name: 'Product Manager 3',
        component: 'Office of Information Technology'
      },
      status: 'Submitted'
    },
    {
      ...initialSystemIntakeForm,
      id: '229f9b64-18fc-4ee1-95c4-9d4b143d215e',
      euaUserID: 'ABCD',
      submittedAt: DateTime.fromObject({ year: 2020, month: 8, day: 26 }),
      requestName: 'Monster System',
      requester: {
        name: 'George Baukerton',
        component: 'Office of Information Technology',
        email: ''
      },
      businessOwner: {
        name: 'Business Owner 4',
        component: 'Office of Information Technology'
      },
      productManager: {
        name: 'Product Manager 4',
        component: 'Office of Information Technology'
      },
      status: 'Submitted'
    }
  ];
  const data = useMemo(() => mockData, [mockData]);

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
