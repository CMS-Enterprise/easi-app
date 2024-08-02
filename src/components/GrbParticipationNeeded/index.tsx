import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import {
  Button,
  IconGroups,
  IconVisibilityOff,
  IconVisiblity,
  Table
} from '@trussworks/react-uswds';
import {
  SystemIntakeWithReviewRequestedFragment,
  useGetSystemIntakesWithReviewRequestedQuery
} from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import IconButton from 'components/shared/IconButton';
import TablePagination from 'components/TablePagination';
import users from 'data/mock/users';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

const systemIntakes: SystemIntakeWithReviewRequestedFragment[] = [
  {
    id: '5af245bc-fc54-4677-bab1-1b3e798bb43c',
    requestName: 'System Intake with GRB Reviewers',
    requesterName: 'User One',
    requesterComponent: 'Office of the Actuary',
    grbDate: '2020-10-08T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Edits requested on initial request form',
    requesterName: users[0].commonName,
    requesterComponent: 'Federal Coordinated Health Care Office',
    grbDate: null,
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Edits requested on initial request form',
    requesterName: users[1].commonName,
    requesterComponent: 'Office of Communications',
    grbDate: '2024-03-29T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Edits requested on initial request form',
    requesterName: users[2].commonName,
    requesterComponent: 'Office of the Actuary',
    grbDate: '2025-06-09T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: 'a5689bec-e4cf-4f2b-a7de-72020e8d65be',
    requestName: 'With GRB scheduled',
    requesterName: users[3].commonName,
    requesterComponent: 'Office of Enterprise Data and Analytics',
    grbDate: '2024-10-02T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: '20cbcfbf-6459-4c96-943b-e76b83122dbf',
    requestName: 'Closable Request',
    requesterName: users[3].commonName,
    requesterComponent: 'Office of Information Technology',
    grbDate: '2023-01-18T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Edits requested on initial request form',
    requesterName: users[2].commonName,
    requesterComponent: 'Office of Information Technology',
    grbDate: null,
    __typename: 'SystemIntake'
  }
];

/**
 * GRB Participation Needed alert box with table of system intakes
 *
 * Only shows if GRB review has been requested from user on at least one intake
 */
const GrbParticipationNeeded = () => {
  const { t } = useTranslation('grbReview');
  const flags = useFlags();

  // Toggles GRB reviews table
  const [showGrbReviews, setShowGrbReviews] = useState<boolean>(false);

  const {
    // data,
    loading
  } = useGetSystemIntakesWithReviewRequestedQuery();

  // const systemIntakes: SystemIntakeWithReviewRequestedFragment[] =
  //   data?.systemIntakesWithReviewRequested || [];

  const columns = useMemo<
    Column<SystemIntakeWithReviewRequestedFragment>[]
  >(() => {
    return [
      {
        Header: t<string>('intake:fields.projectName'),
        accessor: 'requestName',
        Cell: cell => {
          const { row, value } = cell;

          return (
            <UswdsReactLink
              to={`/governance-review-board/${row.original.id}/grb-review`}
            >
              {value}
            </UswdsReactLink>
          );
        }
      },
      {
        Header: t<string>('intake:fields.requester'),
        accessor: ({ requesterName, requesterComponent }) =>
          requesterName
            ? getPersonNameAndComponentAcronym(
                requesterName,
                requesterComponent
              )
            : ''
      },
      {
        Header: t<string>('homepage.grbDate'),
        accessor: 'grbDate',
        Cell: ({ value }) =>
          value
            ? formatDateLocal(value, 'MM/dd/yyyy')
            : t<string>('homepage.noDateSet')
      }
    ];
  }, [t]);

  const table = useTable(
    {
      columns,
      data: systemIntakes,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'grbDate', desc: true }], []),
        pageIndex: 0,
        pageSize: 5
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
    page,
    rows
  } = table;

  // Hide behind grbReviewTab flag
  if (!flags.grbReviewTab) return null;

  // Only show if user has been requested as reviewer
  if (loading || systemIntakes.length === 0) return null;

  return (
    <div className="bg-primary-lighter padding-4">
      <div className="display-flex flex-align-start flex-justify">
        <h2 className="margin-y-0 margin-right-2">
          {t('homepage.participationNeeded')}
        </h2>
        <IconGroups size={4} className="text-primary" />
      </div>

      <p className="line-height-body-5 margin-top-1 margin-bottom-3">
        {t('homepage.participationNeededText')}
      </p>

      {/* Toggle GRB reviews button */}
      <IconButton
        onClick={() => setShowGrbReviews(!showGrbReviews)}
        icon={showGrbReviews ? <IconVisibilityOff /> : <IconVisiblity />}
        type="button"
        unstyled
      >
        {showGrbReviews
          ? t('homepage.hideGrbReviews')
          : t('homepage.showGrbReviews')}
      </IconButton>

      {showGrbReviews && (
        <div className="margin-top-4 margin-bottom-neg-2">
          <Table bordered={false} fullWidth {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      aria-sort={getColumnSortStatus(column)}
                      scope="col"
                      className="border-bottom-2px bg-primary-lighter"
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
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="bg-primary-lighter"
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {rows.length > 0 && (
            <>
              <TablePagination
                {...table}
                pageIndex={table.state.pageIndex}
                pageSize={table.state.pageSize}
                page={[]}
                className="desktop:grid-col-fill desktop:padding-bottom-0"
              />

              <div
                className="usa-sr-only usa-table__announcement-region"
                aria-live="polite"
              >
                {currentTableSortDescription(headerGroups[0])}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GrbParticipationNeeded;
