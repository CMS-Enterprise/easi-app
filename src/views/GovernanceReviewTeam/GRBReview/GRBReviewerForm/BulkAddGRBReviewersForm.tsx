import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, ComboBox, FormGroup, Table } from '@trussworks/react-uswds';
import { useGetGRBReviewersComparisonsQuery } from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import Spinner from 'components/Spinner';
import { GRBReviewerComparison } from 'types/grbReview';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

type BulkAddGRBReviewersFormProps = {
  systemId: string;
};

const BulkAddGRBReviewersForm = ({
  systemId
}: BulkAddGRBReviewersFormProps) => {
  const { t } = useTranslation('grbReview');

  const [activeITGovernanceRequestId, setActiveITGovernanceRequestId] =
    useState<string>();

  const { data, loading } = useGetGRBReviewersComparisonsQuery({
    variables: {
      id: systemId
    }
  });

  const itGovernanceRequests = data?.compareGRBReviewersByIntakeID;

  const grbReviewersArray: GRBReviewerComparison[] | undefined = useMemo(() => {
    if (!activeITGovernanceRequestId) return undefined;

    return itGovernanceRequests?.find(
      ({ id }) => id === activeITGovernanceRequestId
    )?.reviewers;
  }, [activeITGovernanceRequestId, itGovernanceRequests]);

  /** Columns for table */
  const columns = useMemo<Column<GRBReviewerComparison>[]>(() => {
    return [
      {
        Header: t<string>('participantsTable.name'),
        id: 'commonName',
        accessor: ({ userAccount }) => userAccount.commonName
      },
      {
        Header: t<string>('participantsTable.votingRole'),
        accessor: 'votingRole',
        Cell: ({ value }) => t<string>(`votingRoles.${value}`)
      },
      {
        Header: t<string>('participantsTable.grbRole'),
        accessor: 'grbRole',
        Cell: ({ value }) => t<string>(`reviewerRoles.${value}`)
      }
    ];
  }, [t]);

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data: grbReviewersArray || [],
        autoResetSortBy: false,
        autoResetPage: true
        // initialState: {
        //   sortBy: useMemo(() => [{ id: 'commonName', desc: false }], [])
        // }
      },
      useSortBy
    );

  if (loading || !itGovernanceRequests) return <Spinner />;

  return (
    <>
      <p className="line-height-body-5 margin-top-3 tablet:grid-col-6">
        {t('form.addFromRequestDescription')}
      </p>

      <FormGroup className="tablet:grid-col-6">
        <Label
          htmlFor="itGovernanceRequests"
          className="text-normal margin-bottom-05"
        >
          {t('form.itGovernanceRequests')}
        </Label>
        <HelpText id="itGovernanceRequestsHelpText">
          {t('form.itGovernanceRequestsHelpText')}
        </HelpText>

        <ComboBox
          id="itGovernanceRequests"
          name="itGovernanceRequests"
          className="maxw-none"
          onChange={id => setActiveITGovernanceRequestId(id)}
          options={itGovernanceRequests.map(request => ({
            label: request.requestName,
            value: request.id
          }))}
        />
      </FormGroup>

      <div
        className={
          grbReviewersArray ? 'tablet:grid-col-9' : 'tablet:grid-col-6'
        }
      >
        {grbReviewersArray ? (
          <>
            <p className="margin-top-6">
              <Trans
                i18nKey="grbReview:form.grbReviewerResults"
                count={grbReviewersArray.length}
              />
            </p>

            {/* GRB reviewers table */}
            <Table bordered={false} fullWidth scrollable {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        aria-sort={getColumnSortStatus(column)}
                        scope="col"
                        className="border-bottom-2px"
                      >
                        <Button
                          type="button"
                          unstyled
                          className="width-full display-flex margin-top-0"
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
                    <tr
                      {...row.getRowProps()}
                      data-testid={`grbReviewer-${row.original.userAccount.username}`}
                    >
                      {row.cells.map((cell, index) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        ) : (
          <>
            <Alert type="info" className="margin-top-3" slim>
              {t('form.selectRequestAlert')}
            </Alert>

            <Divider className="margin-top-6" />
          </>
        )}
      </div>
    </>
  );
};

export default BulkAddGRBReviewersForm;
