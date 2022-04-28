import React, { createElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
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
  IconErrorOutline,
  IconFilePresent,
  IconHighlightOff,
  Link,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';
import { tempCedarSystemProps } from 'views/Sandbox/mockSystemData';

import './index.scss';

const statusTagClassName: { [key: string]: string } = {
  Open: 'bg-mint',
  Closed: 'border-2px'
};

const RequestCardTestScore = ({
  scorePct,
  date
}: {
  scorePct: number;
  date: string;
}) => {
  const { t } = useTranslation('systemProfile');

  let colorClass;
  let iconComponent;
  if (scorePct === 100) {
    colorClass = 'text-mint';
    iconComponent = IconCheckCircleOutline;
  } else {
    colorClass = 'text-orange';
    iconComponent = IconErrorOutline;
  }

  return (
    <div>
      {createElement(iconComponent, {
        size: 3,
        className: `${colorClass} margin-right-1 text-middle`
      })}
      <span className="text-middle">
        <span className="margin-right-1 text-base">
          {t('singleSystem.section508.initialTest')} {date}
        </span>
        <span>
          {t('singleSystem.section508.score')} {scorePct}%
        </span>
      </span>
    </div>
  );
};

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
        <Tag className={`${statusTagClassName[status]} display-inline-block`}>
          {status}
        </Tag>
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
            <UswdsReactLink
              className="margin-top-1 margin-bottom-2"
              target="_blank"
              rel="noopener noreferrer"
              to="todo"
            >
              {t('singleSystem.section508.viewUploadedDocuments')}
              <IconArrowForward className="margin-left-05 margin-bottom-2px text-tbottom" />
            </UswdsReactLink>
          </>
        )}
        <div />
      </CardBody>
    </Card>
  );
};

const DocumentTable = ({
  columns,
  data,
  documentName
}: {
  columns: any[];
  data: any[];
  documentName?: string;
}) => {
  const { t } = useTranslation('systemProfile');
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
                <button
                  className="usa-button usa-button--unstyled"
                  type="button"
                  {...column.getSortByToggleProps()}
                >
                  {column.render('Header')}
                  {getHeaderSortIcon(column)}
                </button>
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
              {row.cells.map((cell, index) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </UswdsTable>
  );
};

const DocumentCardTable = ({
  title,
  columns,
  data,
  documentName,
  mostRecentDocumentLink,
  uploaded
}: {
  title: string;
  columns?: any[];
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
                      className="text-mint text-middle"
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
          {!columns && !data ? (
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
            <DocumentTable
              columns={columns!}
              data={data!}
              documentName={documentName}
            />
          )}
        </CardBody>
      </Card>
    </CardGroup>
  );
};

export default ({ system }: { system: tempCedarSystemProps }) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const tableColumns = useMemo<Column<any>[]>(
    () => [
      {
        Header: t<string>('singleSystem.section508.table.document'),
        accessor: 'document'
      },
      {
        Header: t<string>('singleSystem.section508.table.uploadDate'),
        accessor: 'uploadDate'
      },
      {
        Header: t<string>('singleSystem.section508.table.actions'),
        accessor: 'actions'
      }
    ],
    [t]
  );
  const tableData = React.useMemo(
    () => [
      {
        document: (
          <div className="display-flex">
            <span className="width-4" style={{ flexShrink: 0 }}>
              <IconFilePresent size={3} />
            </span>
            <Link variant="external">
              <span>Awarded VPAT</span>
            </Link>
          </div>
        ),
        uploadDate: 'mm/dd/yyyy',
        actions: <Link href="#">View</Link>
      },
      {
        document: (
          <div className="display-flex">
            <span className="width-4" style={{ flexShrink: 0 }}>
              <IconFilePresent size={3} />
            </span>
            <Link variant="external">
              <span>Testing testing testing testing multiline VPAT</span>
            </Link>
          </div>
        ),
        uploadDate: 'mm/dd/yyyy',
        actions: <Link href="#">View</Link>
      }
    ],
    []
  );
  return (
    <div id="system-section-508">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
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
                columns={tableColumns}
                data={tableData}
              />
              <DocumentCardTable title="Remediation Plan" />
              <DocumentCardTable
                title="Other documents"
                columns={tableColumns}
                data={tableData}
              />
            </SectionWrapper>
          </Grid>
          {/* Point of contact/ miscellaneous info */}
          <Grid
            desktop={{ col: 4 }}
            className={classnames({
              'sticky-nav': !isMobile
            })}
          >
            {/* Setting a ref here to reference the grid width for the fixed side nav */}
            <div className="side-divider">
              <div className="top-divider" />
              <p className="font-body-xs margin-top-1 margin-bottom-3">
                {t('singleSystem.pointOfContact')}
              </p>
              <h3 className="system-profile__subheader margin-bottom-1">
                Geraldine Hobbs
              </h3>
              <DescriptionDefinition
                definition={t('singleSystem.summary.subheader2')}
              />
              <p>
                <Link
                  aria-label={t('singleSystem.sendEmail')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  variant="external"
                  target="_blank"
                >
                  {t('singleSystem.sendEmail')}
                  <span aria-hidden>&nbsp;</span>
                </Link>
              </p>
              <p>
                <Link
                  aria-label={t('singleSystem.moreContact')}
                  className="line-height-body-5"
                  href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
                  target="_blank"
                >
                  {t('singleSystem.moreContact')}
                  <span aria-hidden>&nbsp;</span>
                  <span aria-hidden>&rarr; </span>
                </Link>
              </p>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};
