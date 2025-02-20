import {
  GetSystemIntakesTable_systemIntakes as SystemIntake,
  GetSystemIntakesTable_systemIntakes_notes as AdminNote
} from 'gql/legacyGQL/types/GetSystemIntakesTable';
import i18next, { TFunction } from 'i18next';
import { sortBy } from 'lodash';

import { formatContractDate } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';

// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

export interface SystemIntakeForTable
  extends Omit<SystemIntake, 'status' | 'contract' | 'fundingSources'> {
  /** String with requester name and component acronym */
  requesterNameAndComponent: string;
  /** Translated status string */
  status: string;
  /** Filter date for portfolio update report */
  filterDate: string | null;
  lastAdminNote: AdminNote | null;
  fundingSources: string;
  contract: {
    hasContract: string | null;
    contractor: string | null;
    vehicle: string | null;
    /** Contract start date converted to string */
    startDate: string;
    /** Contract end date converted to string */
    endDate: string;
  };
}

const getLastAdminNote = (notes: AdminNote[]): AdminNote | null => {
  if (notes.length === 0) return null;

  const sortedNotes = sortBy(notes, 'createdAt').reverse();

  return sortedNotes[0];
};

/**
 * Return funding sources object as string
 *
 * Format: 123456 (source one, source two), 654321 (source three)
 */
export const formatFundingSources = (
  fundingSources: SystemIntake['fundingSources']
): string => {
  /** Formats sources into {fundingNumber: [keys]} object */
  const sourcesObject = fundingSources.reduce<{
    [index: string]: Array<string>;
  }>((acc, { fundingNumber, source }) => {
    if (!fundingNumber || !source) return acc;

    return {
      ...acc,
      [fundingNumber]: [...(acc[fundingNumber] || []), source]
    };
  }, {});

  /** Returns array of formatted funding source strings */
  const stringsArray = Object.keys(sourcesObject).map(
    number => `${number} (${sourcesObject[number].join(', ')})`
  );

  // returns `stringsArray` as comma separated list
  return stringsArray.join(', ');
};

/** Returns array of system intakes formatted for request table and CSV exports */
const tableMap = (
  tableData: SystemIntake[],
  t: TFunction
): SystemIntakeForTable[] => {
  return tableData.map((intake: SystemIntake) => {
    /** Append requester component acronym to name */
    const requesterNameAndComponent = getPersonNameAndComponentAcronym(
      intake.requesterName || '',
      intake.requesterComponent
    );

    let { hasContract } = intake.contract;

    /* Convert contract dates to strings */
    const hasContractDates = ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(
      hasContract || ''
    );
    const contractStartDate = hasContractDates
      ? formatContractDate(intake.contract.startDate)
      : '';
    const contractEndDate = hasContractDates
      ? formatContractDate(intake.contract.endDate)
      : '';

    // Translate `hasContract` value
    if (hasContract) {
      hasContract = t('intake:contractDetails.hasContract', {
        context: hasContract
      });
    }

    const lastAdminNote = getLastAdminNote(intake.notes);

    /** Filter date for portfolio update report - defaults to last admin note date */
    let filterDate: string | null = lastAdminNote
      ? lastAdminNote.createdAt
      : null;

    // If no admin notes, set `filterDate` to last admin action date
    if (!filterDate) {
      const sortedActions = sortBy(intake.actions, 'createdAt').reverse();
      filterDate = sortedActions.length > 0 ? sortedActions[0].createdAt : null;
    }

    // Override all applicable fields in intake to use i18n translations
    return {
      ...intake,
      requesterNameAndComponent,
      fundingSources: formatFundingSources(intake.fundingSources),
      contract: {
        ...intake.contract,
        hasContract,
        startDate: contractStartDate,
        endDate: contractEndDate
      },
      status: i18next.t(
        `governanceReviewTeam:systemIntakeStatusAdmin.${intake.statusAdmin}`,
        {
          lcid: intake.lcid
        }
      ),
      lastAdminNote,
      filterDate
    };
  });
};

export default tableMap;
