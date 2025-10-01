import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
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
import cmsComponentsMap from 'constants/cmsComponentsMap';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

import './index.scss';

type SystemIntakeContactsTableProps = {
  contacts: SystemIntakeContactFragment[] | undefined;
  handleEditContact?: (contact: SystemIntakeContactFragment) => void;
  removeContact?: (id: string) => void;
  /** If true, a loading spinner and text will render in place of results */
  loading?: boolean;
  className?: string;
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
  className
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
          const component = cmsComponentsMap[value];

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
      {
        Header: t('general:actions'),
        id: 'actions',
        accessor: (row: SystemIntakeContactFragment, index) => {
          return (
            <div className="display-flex">
              {handleEditContact && (
                <Button
                  type="button"
                  className="margin-top-0 margin-right-2"
                  onClick={() => handleEditContact(row)}
                  data-testid={`editContact-${index}`}
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
                  data-testid={`removeContact-${index}`}
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

  const table = useTable(
    {
      columns,
      data: contacts || [],
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        hiddenColumns: useMemo(
          () => [
            'createdAt',
            // Hide actions column if `hasActionsColumn` is false
            ...(hasActionsColumn ? [] : ['actions'])
          ],
          [hasActionsColumn]
        ),
        sortBy: useMemo(() => [{ id: 'createdAt', desc: false }], [])
      }
    },
    useSortBy
  );

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

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

                const { id } = row.original;

                return (
                  <tr
                    {...rowProps}
                    key={rowKey}
                    data-testid="contact-row"
                    aria-label={`contact-${id}`}
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
