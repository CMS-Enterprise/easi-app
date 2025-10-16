import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import {
  Button,
  ButtonGroup,
  Icon,
  ModalFooter,
  ModalHeading,
  Table,
  Tooltip
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeContactFragment,
  SystemIntakeContactRole
} from 'gql/generated/graphql';

import Modal from 'components/Modal';
import Spinner from 'components/Spinner';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import { getComponentByEnum } from 'constants/cmsComponentsMap';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

import './index.scss';

type SystemIntakeContactsTableProps = {
  contacts: SystemIntakeContactFragment[] | undefined;
  handleEditContact?: (contact: SystemIntakeContactFragment) => void;
  removeContact?: (id: string) => void;
  /** If true, a loading spinner and text will render in place of results */
  loading?: boolean;
  className?: string;
  pageSize?: number;
};

/**
 * Table component to display system intake contacts
 *
 * Renders actions column and button(s) if handleEditContact and/or removeContact is provided
 */
const SystemIntakeContactsTable = ({
  contacts,
  handleEditContact,
  removeContact,
  loading,
  className,
  pageSize = 10
}: SystemIntakeContactsTableProps) => {
  const { t } = useTranslation('intake');

  const [contactIdToRemove, setContactIdToRemove] = useState<string | null>(
    null
  );

  /** Returns true if either `handleEditContact` or `removeContact` is provided */
  const hasActionsColumn = useMemo(
    () => !!handleEditContact || !!removeContact,
    [handleEditContact, removeContact]
  );

  const columns = useMemo<Column<SystemIntakeContactFragment>[]>(() => {
    return [
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
          const component = getComponentByEnum(value);

          if (!component) return null;

          // Display acronym if available, otherwise display component label
          return <>{component.acronym || t(component.labelKey)}</>;
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
      {
        Header: t('general:actions'),
        id: 'actions',
        accessor: (row: SystemIntakeContactFragment) => {
          return (
            <div className="display-flex">
              {handleEditContact && (
                <Button
                  type="button"
                  className="margin-top-0 margin-right-2"
                  onClick={() => handleEditContact(row)}
                  data-testid={`editContact-${row.userAccount.username}`}
                  unstyled
                >
                  {t('general:edit')}
                </Button>
              )}
              {removeContact && (
                <Button
                  type="button"
                  className={classNames(
                    'margin-top-0',
                    row.isRequester ? 'text-disabled' : 'text-error'
                  )}
                  unstyled
                  onClick={() => setContactIdToRemove(row.id)}
                  data-testid={`removeContact-${row.userAccount.username}`}
                  disabled={row.isRequester}
                >
                  {t('general:remove')}
                </Button>
              )}
            </div>
          );
        },
        width: 140
      }
    ];
  }, [t, handleEditContact, removeContact]);

  // Pre-sort the data to ensure isRequester contacts appear first
  const sortedContacts = useMemo(() => {
    if (!contacts) return [];

    return [...contacts].sort((a, b) => {
      // First sort by isRequester (true values first)
      if (a.isRequester && !b.isRequester) return -1;
      if (!a.isRequester && b.isRequester) return 1;

      // Then sort by createdAt (oldest first)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [contacts]);

  const table = useTable(
    {
      columns,
      data: sortedContacts,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        hiddenColumns: useMemo(
          () => [
            // Hide actions column if `hasActionsColumn` is false
            ...(hasActionsColumn ? [] : ['actions'])
          ],
          [hasActionsColumn]
        ),
        sortBy: useMemo(() => [], []),
        pageIndex: 0,
        pageSize
      }
    },
    useSortBy,
    usePagination
  );

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    setPageSize
  } = table;

  rows.map(row => prepareRow(row));

  return (
    <>
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

                const { username } = row.original.userAccount;

                return (
                  <tr
                    {...rowProps}
                    key={rowKey}
                    data-testid={`contact-row-${username}`}
                    aria-label={`contact-${username}`}
                  >
                    {row.cells.map(cell => {
                      const { key: cellKey, ...cellProps } =
                        cell.getCellProps();

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

        {rows.length > pageSize && (
          <div className="display-flex flex-row flex-justify-between">
            <TablePagination
              {...table}
              pageIndex={table.state.pageIndex}
              pageSize={table.state.pageSize}
              page={[]}
              className="desktop:grid-col-fill desktop:padding-bottom-0"
            />
            <TablePageSize
              className="desktop:grid-col-auto"
              pageSize={table.state.pageSize}
              setPageSize={setPageSize}
              suffix="rows"
            />

            <div
              className="usa-sr-only usa-table__announcement-region"
              aria-live="polite"
            >
              {currentTableSortDescription(headerGroups[0])}
            </div>
          </div>
        )}
      </div>

      {/* Remove contact modal */}
      {removeContact && (
        <Modal
          isOpen={!!contactIdToRemove}
          closeModal={() => setContactIdToRemove(null)}
          className="font-body-md"
        >
          <ModalHeading>
            {t('contactDetails.additionalContacts.removeModal.heading')}
          </ModalHeading>
          <p>
            {t('contactDetails.additionalContacts.removeModal.description')}
          </p>

          <ModalFooter>
            <ButtonGroup>
              <Button
                type="button"
                className="margin-right-2 bg-error"
                onClick={() => {
                  if (contactIdToRemove) {
                    removeContact(contactIdToRemove);
                  }

                  setContactIdToRemove(null);
                }}
              >
                {t('contactDetails.additionalContacts.removeModal.submit')}
              </Button>

              <Button
                type="button"
                onClick={() => setContactIdToRemove(null)}
                unstyled
              >
                {t('general:cancel')}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default SystemIntakeContactsTable;
