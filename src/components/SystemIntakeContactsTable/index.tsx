import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, Icon, Table, Tooltip } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetSystemIntakeContactsQuery,
  SystemIntakeContactFragment,
  SystemIntakeContactRole
} from 'gql/generated/graphql';

import Spinner from 'components/Spinner';
import cmsComponents from 'constants/cmsComponents';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

import './index.scss';

type SystemIntakeContactsTableProps = {
  systemIntakeContacts: GetSystemIntakeContactsQuery['systemIntakeContacts'];
  loading: boolean;
  /** Sets contact to edit with form modal. If undefined, actions column will not render. */
  handleEditContact?: (contact: SystemIntakeContactFragment) => void;
  className?: string;
};

const SystemIntakeContactsTable = ({
  systemIntakeContacts,
  loading,
  handleEditContact,
  className
}: SystemIntakeContactsTableProps) => {
  const { t } = useTranslation('intake');

  const columns = useMemo<Column<SystemIntakeContactFragment>[]>(() => {
    const actionsColumn: Column<SystemIntakeContactFragment> = {
      Header: t('general:actions'),
      id: 'actions',
      accessor: (row: SystemIntakeContactFragment, index) => {
        return (
          <div className="display-flex">
            <Button
              type="button"
              className="margin-top-0 margin-right-2"
              onClick={() => handleEditContact?.(row)}
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
      },
      width: 140
    };

    return [
      {
        // createdAt column is hidden and only used for sorting purposes
        accessor: 'createdAt',
        id: 'createdAt'
      },
      {
        Header: () => (
          <span className="display-block margin-left-4 padding-left-05">
            {t('general:name')}
          </span>
        ),
        accessor: (row: SystemIntakeContactFragment) =>
          row.userAccount.commonName,
        id: 'commonName',
        width: handleEditContact ? 320 : 'auto',
        Cell: ({ row }: { row: { original: SystemIntakeContactFragment } }) => (
          <div className="display-flex flex-align-center">
            {row.original.isRequester && (
              <Tooltip
                position="top"
                label={t('contactDetails.additionalContacts.requesterTooltip')}
                className="padding-0 margin-0 margin-top-1 bg-transparent outline-0"
              >
                <Icon.ContactPage
                  className="text-primary"
                  size={3}
                  aria-label={t(
                    'contactDetails.additionalContacts.primaryRequester'
                  )}
                />
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
        width: handleEditContact ? 150 : 200,
        Cell: ({
          value
        }: {
          value: SystemIntakeContactFragment['component'];
        }) => {
          if (!value) {
            return (
              <span className="text-base-dark text-italic">
                {t('general:noneSpecified')}
              </span>
            );
          }

          // Get component data using enum value
          const component = cmsComponents[value];

          // Display acronym if available, otherwise display component name
          return <>{component.acronym || t(component.name)}</>;
        }
      },
      {
        Header: t('fields.roles'),
        accessor: 'roles',
        id: 'roles',
        width: 'auto',
        Cell: ({ value: roles }: { value: SystemIntakeContactRole[] }) => {
          if (roles.length === 0) {
            return (
              <span className="text-base-dark text-italic">
                {t('general:noneSpecified')}
              </span>
            );
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
      ...(handleEditContact ? [actionsColumn] : [])
    ];
  }, [t, handleEditContact]);

  const contacts = systemIntakeContacts?.allContacts || [];

  const table = useTable(
    {
      columns,
      data: contacts,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        hiddenColumns: useMemo(() => ['createdAt'], []),
        sortBy: useMemo(() => [{ id: 'createdAt', desc: false }], [])
      }
    },
    useSortBy
  );

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

  rows.map(row => prepareRow(row));

  return (
    <div
      className={classNames(
        'system-intake-contacts-table usa-table-container--scrollable',
        className
      )}
    >
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
          {rows.length > 0 ? (
            rows.map(row => {
              const { key: rowKey, ...rowProps } = row.getRowProps();

              const { id } = row.original;

              return (
                <tr
                  {...rowProps}
                  key={rowKey}
                  data-testid="contact-row"
                  aria-label={`contact-${id}`}
                >
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
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="padding-left-4">
                <span className="margin-left-05 display-flex flex-align-center text-italic">
                  {loading ? (
                    <>
                      <Spinner size="small" className="margin-right-1" />
                      {t('contactDetails.loadingContacts')}
                    </>
                  ) : (
                    t('contactDetails.noContacts')
                  )}
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SystemIntakeContactsTable;
