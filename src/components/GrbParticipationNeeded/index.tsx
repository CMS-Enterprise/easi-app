import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
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

import IconButton from 'components/shared/IconButton';
import { formatDateLocal } from 'utils/date';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

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

  const systemIntakes: SystemIntakeWithReviewRequestedFragment[] =
    data?.systemIntakesWithReviewRequested || [];

  const columns = useMemo<
    Column<SystemIntakeWithReviewRequestedFragment>[]
  >(() => {
    return [
      {
        Header: t<string>('intake:fields.projectName'),
        accessor: 'requestName'
      },
      {
        Header: t<string>('intake:fields.requester'),
        accessor: 'requesterName'
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

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows
  } = useTable(
    {
      columns,
      data: systemIntakes,
      autoResetSortBy: false,
      autoResetPage: true
      // initialState: {
      //   sortBy: useMemo(() => [{ id: 'uploadedAt', desc: true }], [])
      // }
    },
    useSortBy
  );

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
            {rows.map(row => {
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
      )}
    </div>
  );
};

export default GrbParticipationNeeded;
