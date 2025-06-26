import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { Button, Icon, Table } from '@trussworks/react-uswds';
import {
  SystemIntakeWithReviewRequestedFragment,
  useGetSystemIntakesWithReviewRequestedQuery
} from 'gql/generated/graphql';

import Divider from 'components/Divider';
import IconButton from 'components/IconButton';
import UswdsReactLink from 'components/LinkWrapper';
import TablePagination from 'components/TablePagination';
import { formatDateLocal, isDateInPast } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

/**
 * Sort GRB dates
 *
 * No date set - order first,
 * Future dates - closest dates first,
 * Past dates - order last
 */
export const sortGrbDates = (
  grbDateA: string | null,
  grbDateB: string | null
) => {
  // Sort null dates first
  if (grbDateA === null) return 1;
  if (grbDateB === null) return -1;

  // Sort past dates
  if (isDateInPast(grbDateA) || isDateInPast(grbDateB)) {
    return grbDateA < grbDateB ? -1 : 1;
  }

  // Sort future dates
  if (grbDateA === grbDateB) return 0;
  return grbDateA > grbDateB ? -1 : 1;
};

/**
 * GRB Participation Needed alert box with table of system intakes
 *
 * Only shows if GRB review has been requested from user on at least one intake
 */
const GrbParticipationNeeded = () => {
  const { t } = useTranslation('grbReview');

  // Toggles GRB reviews table
  const [showGrbReviews, setShowGrbReviews] = useState<boolean>(false);

  const { data, loading } = useGetSystemIntakesWithReviewRequestedQuery();

  const systemIntakes = useMemo(
    () => data?.systemIntakesWithReviewRequested || [],
    [data?.systemIntakesWithReviewRequested]
  );

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
            <UswdsReactLink to={`/it-governance/${row.original.id}/grb-review`}>
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
        Cell: cell => {
          const { value } = cell;
          return (
            <>
              {value
                ? formatDateLocal(value, 'MM/dd/yyyy')
                : t<string>('homepage.noDateSet')}
            </>
          );
        },
        sortType: (rowA, rowB) =>
          sortGrbDates(rowA.values.grbDate, rowB.values.grbDate)
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

  // Only show if user has been requested as reviewer
  if (loading || systemIntakes.length === 0) return null;

  return (
    <>
      <div className="bg-primary-lighter padding-4">
        <div className="display-flex flex-align-start flex-justify">
          <h2 className="margin-y-0 margin-right-2">
            {t('homepage.participationNeeded')}
          </h2>
          <Icon.Groups size={4} className="text-primary" aria-hidden />
        </div>

        <p className="line-height-body-5 margin-top-1 margin-bottom-3">
          {t('homepage.participationNeededText')}
        </p>

        {/* Toggle GRB reviews button */}
        <IconButton
          onClick={() => setShowGrbReviews(!showGrbReviews)}
          icon={
            showGrbReviews ? (
              <Icon.VisibilityOff aria-label="visibility-off" />
            ) : (
              <Icon.Visibility aria-label="visibility-on" />
            )
          }
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
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={{ ...headerGroup.getHeaderGroupProps() }.key}
                  >
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        aria-sort={getColumnSortStatus(column)}
                        scope="col"
                        className="border-bottom-2px bg-primary-lighter"
                        key={column.id}
                      >
                        <Button
                          type="button"
                          unstyled
                          {...column.getSortByToggleProps()}
                        >
                          {column.render('Header')}
                          {getHeaderSortIcon(column)}
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
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map(cell => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={{ ...cell.getCellProps() }.key}
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

      <Divider className="margin-top-6" />
    </>
  );
};

export default GrbParticipationNeeded;
