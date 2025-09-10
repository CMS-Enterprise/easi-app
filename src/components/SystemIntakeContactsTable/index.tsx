import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, Icon, Table, Tooltip } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeContactFragment,
  SystemIntakeContactRole,
  useGetSystemIntakeContactsQuery
} from 'gql/generated/graphql';

import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

import './index.scss';

const SystemIntakeContactsTable = ({
  systemIntakeId
}: {
  systemIntakeId: string;
}) => {
  const { t } = useTranslation('intake');

  const { data } = useGetSystemIntakeContactsQuery({
    variables: {
      id: systemIntakeId
    }
  });

  const { additionalContacts = [] } = data?.systemIntakeContacts || {};

  const columns = useMemo<Column<SystemIntakeContactFragment>[]>(
    () => [
      {
        Header: () => (
          <span className="display-block margin-left-4 padding-left-05">
            {t('general:name')}
          </span>
        ),
        accessor: (row: SystemIntakeContactFragment) =>
          row.userAccount.commonName,
        id: 'commonName',
        Cell: ({ row }: { row: { original: SystemIntakeContactFragment } }) => (
          <div className="display-flex flex-align-center">
            {row.original.isRequester && (
              <Tooltip
                position="top"
                label={t('contactDetails.additionalContacts.requesterTooltip')}
                className="padding-0 margin-0 margin-top-1 bg-transparent outline-0"
              >
                <Icon.ContactPage className="text-primary" size={3} />
              </Tooltip>
            )}
            <div
              className={classNames(
                row.original.isRequester
                  ? 'margin-left-105'
                  : 'margin-left-4 padding-left-05'
              )}
            >
              <p data-testid="commonName">
                {row.original.userAccount.commonName}
              </p>
              <p data-testid="email">{row.original.userAccount.email}</p>
            </div>
          </div>
        )
      },
      {
        Header: t('fields.component'),
        accessor: 'component',
        id: 'component',
        Cell: ({
          value: component
        }: {
          value: SystemIntakeContactFragment['component'];
        }) => <>{component || t('general:noneSpecified')}</>
      },
      {
        Header: t('fields.roles'),
        accessor: 'roles',
        id: 'roles',
        Cell: ({ value: roles }: { value: SystemIntakeContactRole[] }) => {
          if (roles.length === 0) {
            return <>{t('general:noneSpecified')}</>;
          }

          // Return list of translated enum values
          return (
            <>
              {roles
                .map(role =>
                  t(`contactDetails.systemIntakeContactRoles.${role}`)
                )
                .join(', ')}
            </>
          );
        }
      },
      {
        Header: t('general:actions'),
        id: 'actions',
        accessor: (row: SystemIntakeContactFragment, index) => {
          return (
            <div className="display-flex">
              <Button
                type="button"
                className="margin-top-0 margin-right-2"
                onClick={() => null}
                data-testid={`editContact-${index}`}
                unstyled
              >
                {t('general:edit')}
              </Button>
              <Button
                type="button"
                className={classNames(
                  'margin-top-0',
                  row.isRequester ? 'text-disabled' : 'text-error'
                )}
                unstyled
                onClick={() => null}
                data-testid={`removeContact-${index}`}
                disabled={row.isRequester}
              >
                {t('general:remove')}
              </Button>
            </div>
          );
        }
      }
    ],
    [t]
  );

  const table = useTable(
    {
      columns,
      data: additionalContacts,
      autoResetSortBy: false,
      autoResetPage: true
    },
    useSortBy
  );

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

  return (
    <div className="system-intake-contacts-table usa-table-container--scrollable">
      <Table bordered={false} fullWidth {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => {
            const { key, ...headerGroupProps } =
              headerGroup.getHeaderGroupProps();

            return (
              <tr {...headerGroupProps} key={key}>
                {headerGroup.headers.map(column => {
                  const { key: headerKey, ...headerProps } =
                    column.getHeaderProps();

                  if (column.id === 'actions') {
                    return (
                      <th
                        {...headerProps}
                        key={headerKey}
                        className="border-bottom-2px"
                        style={{
                          width: column.width
                        }}
                      >
                        {column.render('Header')}
                      </th>
                    );
                  }

                  return (
                    <th
                      {...headerProps}
                      key={headerKey}
                      aria-sort={getColumnSortStatus(column)}
                      scope="col"
                      className="border-bottom-2px"
                      style={{
                        width: column.width
                      }}
                    >
                      <Button
                        type="button"
                        className="width-full flex-justify margin-y-0"
                        unstyled
                        {...column.getSortByToggleProps()}
                      >
                        {column.render('Header')}
                        {getHeaderSortIcon(column)}
                      </Button>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();

            const { id } = row.original;

            return (
              <tr {...rowProps} key={rowKey} data-testid={`contact-${id}`}>
                {row.cells.map(cell => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();

                  return (
                    <td {...cellProps} key={cellKey}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default SystemIntakeContactsTable;
