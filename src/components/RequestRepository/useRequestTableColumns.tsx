import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CellProps, Column, Row } from 'react-table';
import { IconError } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import TruncatedText from 'components/shared/TruncatedText';
import { SystemIntakeStatusAdmin } from 'types/graphql-global-types';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import { SystemIntakeStatusAdminIndex } from 'utils/tableRequestStatusIndex';

import { SystemIntakeForTable } from './tableMap';

/**
 * Returns array of request table columns based on active tab
 *
 * For use with `useTable` in `RequestRepository`
 */
const useRequestTableColumns = (
  activeTable: 'open' | 'closed'
): Array<Column<SystemIntakeForTable>> => {
  const { t } = useTranslation('governanceReviewTeam');

  // Character limit for length of free text (Admin Note, LCID Scope, etc.), any
  // text longer then this limit will be displayed with a button to allow users
  // to expand/unexpand the text
  const freeFormTextCharLimit = 25;

  const submissionDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.submissionDate'),
    accessor: 'submittedAt',
    Cell: cell => {
      if (cell.value) {
        return formatDateLocal(cell.value, 'MM/dd/yyyy');
      }

      return t('requestRepository.table.submissionDate.null');
    }
  };

  const requestNameColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.projectName'),
    accessor: 'requestName',
    Cell: ({
      row,
      value
    }: CellProps<
      SystemIntakeForTable,
      SystemIntakeForTable['requestName']
    >) => {
      return (
        <Link
          className="usa-link"
          to={`/governance-review-team/${row.original.id}/intake-request`}
        >
          {value}
        </Link>
      );
    }
  };

  const requesterColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:contactDetails.requester'),
    accessor: 'requesterNameAndComponent'
  };

  const adminLeadColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.adminLead'),
    accessor: ({ adminLead }) =>
      adminLead || t<string>('governanceReviewTeam:adminLeads.notAssigned'),
    Cell: ({
      value: adminLead
    }: CellProps<SystemIntakeForTable, SystemIntakeForTable['adminLead']>) => {
      if (adminLead === t('governanceReviewTeam:adminLeads.notAssigned')) {
        return (
          <div className="display-flex flex-align-center">
            {/* TODO: should probably make this a button that opens up the assign admin
                lead automatically. Similar to the Dates functionality */}
            <IconError className="text-secondary margin-right-05" />
            {adminLead}
          </div>
        );
      }
      return adminLead;
    }
  };

  const grtDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.grtDate'),
    accessor: 'grtDate',
    Cell: ({
      row,
      value
    }: CellProps<SystemIntakeForTable, SystemIntakeForTable['grtDate']>) => {
      if (!value) {
        return (
          <UswdsReactLink
            data-testid="add-grt-date-cta"
            to={`/governance-review-team/${row.original.id}/dates`}
          >
            {t('requestRepository.table.addDate')}
          </UswdsReactLink>
        );
      }
      return formatDateUtc(value, 'MM/dd/yyyy');
    }
  };

  const grbDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.grbDate'),
    accessor: 'grbDate',
    Cell: ({
      row,
      value
    }: CellProps<SystemIntakeForTable, SystemIntakeForTable['grbDate']>) => {
      if (!value) {
        return (
          <UswdsReactLink
            data-testid="add-grb-date-cta"
            to={`/governance-review-team/${row.original.id}/dates`}
          >
            {t('requestRepository.table.addDate')}
          </UswdsReactLink>
        );
      }
      return formatDateUtc(value, 'MM/dd/yyyy');
    }
  };

  const statusColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.status'),
    id: 'statusAdmin',
    accessor: obj => {
      return t(
        `governanceReviewTeam:systemIntakeStatusAdmin.${obj.statusAdmin}`,
        {
          lcid: obj.lcid
        }
      );
    },
    sortType: (a: Row<SystemIntakeForTable>, b: Row<SystemIntakeForTable>) => {
      // console.log(a.original);
      // console.log(b.original);

      const astatus = a.original.statusAdmin;
      const bstatus = b.original.statusAdmin;

      if (
        (astatus === SystemIntakeStatusAdmin.LCID_ISSUED &&
          bstatus === SystemIntakeStatusAdmin.LCID_ISSUED) ||
        (astatus === SystemIntakeStatusAdmin.LCID_EXPIRED &&
          bstatus === SystemIntakeStatusAdmin.LCID_EXPIRED)
      ) {
        return (a.original.lcid || '') > (b.original.lcid || '') ? 1 : -1;
      }

      const ai = SystemIntakeStatusAdminIndex[astatus];
      const bi = SystemIntakeStatusAdminIndex[bstatus];
      return ai > bi ? 1 : -1;
    }
  };

  const lcidExpirationDateColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.lcidExpirationDate'),
    accessor: 'lcidExpiresAt',
    Cell: ({ value: lcidExpiresAt }) => {
      if (lcidExpiresAt) {
        return formatDateUtc(lcidExpiresAt, 'MM/dd/yyyy');
      }

      // If no LCID Expiration exists, display 'No LCID Issued'
      return 'No LCID Issued';
    }
  };

  const lastAdminNoteColumn: Column<SystemIntakeForTable> = {
    Header: t<string>('intake:fields.lastAdminNote'),
    accessor: 'lastAdminNote',
    Cell: ({
      value: lastAdminNote
    }: {
      value: SystemIntakeForTable['lastAdminNote'];
    }) => {
      if (!lastAdminNote) return 'No Admin Notes';

      return (
        // Display admin note using truncated text field that
        // will display note with expandable extra text (if applicable)
        <>
          {formatDateLocal(lastAdminNote.createdAt, 'MM/dd/yyyy')}

          <TruncatedText
            id="last-admin-note"
            label="less"
            closeLabel="more"
            text={lastAdminNote.content}
            charLimit={freeFormTextCharLimit}
            isRich
          />
        </>
      );
    },
    sortType: (a: Row<SystemIntakeForTable>, b: Row<SystemIntakeForTable>) =>
      (a.values.lastAdminNote?.createdAt ?? '') >
      (b.values.lastAdminNote?.createdAt ?? '')
        ? 1
        : -1
  };

  return useMemo(() => {
    if (activeTable === 'open') {
      return [
        submissionDateColumn,
        requestNameColumn,
        requesterColumn,
        adminLeadColumn,
        statusColumn,
        grtDateColumn,
        grbDateColumn
      ];
    }
    if (activeTable === 'closed') {
      return [
        submissionDateColumn,
        requestNameColumn,
        requesterColumn,
        lcidExpirationDateColumn,
        statusColumn,
        lastAdminNoteColumn
      ];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTable, t]);
};

export default useRequestTableColumns;
