import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortBy, useTable } from 'react-table';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  GridContainer,
  IconArrowForward,
  IconCheckCircleOutline,
  IconFilePresent,
  IconHighlightOff,
  IconLaunch,
  Link,
  Table as UswdsTable
} from '@trussworks/react-uswds';

// import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';
import RequestCardTestScore from 'views/SystemProfile/RequestCardTestScore';
import RequestStatusTag, {
  RequestStatus
} from 'views/SystemProfile/RequestStatusTag';

import { SystemProfileSubComponentProps } from '..';

import './index.scss';

const RequestCard = ({
  name,
  status,
  changeDate,
  numTests,
  initialTestDate,
  scorePct,
  businessOwner,
  submissionDate,
  numUploadedDocuments
}: {
  name: string;
  status: string;
  changeDate?: string;
  numTests?: number;
  initialTestDate?: string;
  scorePct?: number;
  businessOwner?: string;
  submissionDate?: string;
  numUploadedDocuments?: number;
}) => {
  const { t } = useTranslation('systemProfile');
  return (
    <Card className="width-full">
      <CardHeader className="padding-2 padding-bottom-0">
        <h5 className="margin-y-0 padding-bottom-1px font-sans-xs line-height-heading-2 text-normal">
          {t('singleSystem.section508.requestName')}
        </h5>
        <h3 className="margin-top-0 line-height-heading-2">{name}</h3>
      </CardHeader>
      <CardBody className="padding-x-2 padding-top-0 padding-bottom-2">
        <h5 className="margin-top-2 margin-bottom-1 font-sans-2xs text-normal">
          {t('singleSystem.section508.currentStatus')}
          {changeDate && (
            <span className="margin-left-1 text-base">
              {t('singleSystem.section508.statusChanged')} {changeDate}
            </span>
          )}
        </h5>
        <RequestStatusTag status={status as RequestStatus} />
        {numTests !== undefined &&
          scorePct !== undefined &&
          initialTestDate !== undefined && (
            <>
              <Divider className="margin-y-2" />
              <div className="margin-bottom-1">
                <strong>{numTests}</strong> {t('singleSystem.section508.test')}
              </div>
              <RequestCardTestScore
                scorePct={scorePct}
                date={initialTestDate}
              />
            </>
          )}
        {businessOwner !== undefined && submissionDate !== undefined && (
          <>
            <Divider className="margin-y-2" />
            <GridContainer className="padding-x-0">
              <Grid row>
                <Grid tablet={{ col: true }}>
                  <DescriptionTerm
                    className="margin-bottom-0"
                    term={t('singleSystem.section508.businessOwner')}
                  />
                  <DescriptionDefinition
                    className="font-body-md line-height-body-4"
                    definition={businessOwner}
                  />
                </Grid>
                <Grid tablet={{ col: true }}>
                  <DescriptionTerm
                    className="margin-bottom-0"
                    term={t('singleSystem.section508.submissionDate')}
                  />
                  <DescriptionDefinition
                    className="font-body-md line-height-body-4"
                    definition={submissionDate}
                  />
                </Grid>
              </Grid>
            </GridContainer>
          </>
        )}
        {numUploadedDocuments !== undefined && (
          <>
            <Divider className="margin-y-2" />
            <div>
              <span className="text-bold">{numUploadedDocuments}</span>{' '}
              {t('singleSystem.section508.uploadedDocuments')}
            </div>
            <Button type="button" unstyled className="margin-top-1">
              {t('singleSystem.section508.viewUploadedDocuments')}
              <IconArrowForward className="margin-left-05 margin-bottom-2px text-tbottom" />
            </Button>
          </>
        )}
        <div />
      </CardBody>
    </Card>
  );
};

const DocumentTable = ({
  data,
  documentName
}: {
  data: any[];
  documentName?: string;
}) => {
  const { t } = useTranslation('systemProfile');

  const columns = useMemo(
    () => [
      {
        Header: t<string>('singleSystem.section508.table.document'),
        accessor: 'document',
        Cell: ({
          cell: {
            value: { name, href }
          }
        }: {
          cell: {
            value: {
              name: string;
              href: string;
            };
          };
        }) => {
          return (
            <div className="display-flex">
              <span
                className="width-4"
                style={{ flexShrink: 0, lineHeight: 0 }}
              >
                <IconFilePresent size={3} />
              </span>
              <Link href={href}>
                <span>{name}</span>
                <IconLaunch className="margin-left-05 margin-bottom-2px text-tbottom" />
              </Link>
            </div>
          );
        }
      },
      {
        Header: t<string>('singleSystem.section508.table.uploadDate'),
        accessor: 'uploadDate'
      },
      {
        Header: t<string>('singleSystem.section508.table.actions'),
        accessor: 'actions',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => {
          return <Link href={value}>View</Link>;
        }
      }
    ],
    [t]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );
  return (
    <UswdsTable
      bordered={false}
      fullWidth
      scrollable
      caption={
        documentName &&
        `${t('singleSystem.section508.additional')} ${documentName}s`
      }
      {...getTableProps()}
    >
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
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </UswdsTable>
  );
};

const DocumentCardTable = ({
  title,
  data,
  documentName,
  mostRecentDocumentLink,
  uploaded
}: {
  title: string;
  data?: any[];
  documentName?: string;
  mostRecentDocumentLink?: string;
  uploaded?: string;
}) => {
  const { t } = useTranslation('systemProfile');
  return (
    <CardGroup className="margin-0">
      <Card className="width-full">
        <CardHeader className="padding-2 padding-bottom-0">
          <span className="display-inline-block width-4 text-top">
            <IconFilePresent size={3} />
          </span>
          <h3 className="display-inline-block margin-top-0 line-height-heading-2">
            {title}
          </h3>
        </CardHeader>
        <CardBody className="padding-x-2 padding-top-0 padding-bottom-2">
          {documentName && mostRecentDocumentLink !== undefined && (
            <>
              <Link
                href={mostRecentDocumentLink}
                variant="external"
                className="margin-top-05 margin-left-4"
              >
                {t('singleSystem.section508.viewMostRecent')} {documentName}
              </Link>
              {uploaded && (
                <div className="margin-top-2">
                  <span className="display-inline-block width-4">
                    <IconCheckCircleOutline
                      size={3}
                      className="text-success text-middle"
                    />
                  </span>
                  <span className="text-middle">
                    {t('singleSystem.section508.uploaded')} {uploaded}
                  </span>
                </div>
              )}
              <Divider className="margin-y-2" />
            </>
          )}
          {!data ? (
            <div className="margin-top-2">
              <span className="display-inline-block width-4">
                <IconHighlightOff
                  size={3}
                  className="text-base-light text-middle"
                />
              </span>
              <span className="text-middle">No {title}s available</span>
            </div>
          ) : (
            <DocumentTable data={data!} documentName={documentName} />
          )}
        </CardBody>
      </Card>
    </CardGroup>
  );
};

export default ({ system }: SystemProfileSubComponentProps) => {
  const { t } = useTranslation('systemProfile');

  const tableData = useMemo(
    () => [
      {
        document: { name: 'Awarded VPAT', href: '/' },
        uploadDate: 'mm/dd/yyyy',
        actions: '/'
      },
      {
        document: {
          name: 'Testing testing testing testing multiline VPAT',
          href: '/'
        },
        uploadDate: 'mm/dd/yyyy',
        actions: '/'
      }
    ],
    []
  );

  return (
    <>
      <SectionWrapper borderBottom className="padding-bottom-4">
        <h2 className="margin-top-0 margin-bottom-4 line-height-heading-2">
          {t('singleSystem.section508.openRequests')}
        </h2>
        <CardGroup className="margin-0">
          <RequestCard
            name="My test for HAM"
            status="Open"
            numTests={1}
            initialTestDate="mm/dd/yyyy"
            scorePct={98}
            businessOwner="Geraldine"
            submissionDate="March"
            numUploadedDocuments={4}
          />
        </CardGroup>
        <div className="margin-top-1">
          <Button type="button" outline>
            {t('singleSystem.section508.startNewRequest')}
          </Button>
        </div>
      </SectionWrapper>
      <SectionWrapper borderBottom className="padding-y-4">
        <h2 className="margin-top-0 margin-bottom-4">
          {t('singleSystem.section508.closedRequests')}
        </h2>
        <CardGroup className="margin-0">
          <RequestCard
            name="My test for HAM"
            status="Closed"
            changeDate="02/08/2020"
            numTests={1}
            initialTestDate="mm/dd/yyyy"
            scorePct={100}
          />
          <RequestCard
            name="My test for HAM"
            status="Closed"
            changeDate="02/08/2020"
          />
        </CardGroup>
      </SectionWrapper>
      <SectionWrapper>
        <h2>{t('singleSystem.section508.testingDocuments')}</h2>
        <DocumentCardTable
          title="Voluntary Product Accessibility Template"
          documentName="VPAT"
          mostRecentDocumentLink=""
          uploaded="September 12, 2021"
          data={tableData}
        />
        <DocumentCardTable title="Remediation Plan" />
        <DocumentCardTable title="Other documents" data={tableData} />
      </SectionWrapper>
    </>
  );
};
