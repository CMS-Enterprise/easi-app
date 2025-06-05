import { GetSystemIntakesTableQuery } from 'gql/generated/graphql';
import i18next, { TFunction } from 'i18next';
import { sortBy } from 'lodash';

import { formatContractDate } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';

export type TableSystemIntake =
  GetSystemIntakesTableQuery['systemIntakes'][number];

export type TableSystemIntakeFundingSources =
  TableSystemIntake['fundingSources'][number];

export type TableSystemIntakeNotes = TableSystemIntake['notes'][number];

// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

export interface SystemIntakeForTable
  extends Omit<TableSystemIntake, 'status' | 'contract' | 'fundingSources'> {
  /** String with requester name and component acronym */
  requesterNameAndComponent: string;
  /** Translated status string */
  status: string;
  /** Filter date for portfolio update report */
  filterDate: string | null | undefined;
  lastAdminNote: TableSystemIntakeNotes | null;
  fundingSources: string;
  contract: {
    hasContract: string | null | undefined;
    contractor: string | null | undefined;
    vehicle: string | null;
    /** Contract start date converted to string */
    startDate: string;
    /** Contract end date converted to string */
    endDate: string;
    __typename: string;
  };
}

const getLastAdminNote = (
  notes: TableSystemIntakeNotes[]
): TableSystemIntakeNotes | null => {
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
  fundingSources: TableSystemIntake['fundingSources']
): string => {
  /** Formats sources into {projectNumber: [keys]} object */
  const sourcesObject = fundingSources.reduce<{
    [index: string]: Array<string>;
  }>((acc, { projectNumber, investment }) => {
    if (!projectNumber || !investment) return acc;

    return {
      ...acc,
      [projectNumber]: [...(acc[projectNumber] || []), investment]
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
  tableData: TableSystemIntake[],
  t: TFunction
): SystemIntakeForTable[] => {
  return tableData.map((intake: TableSystemIntake) => {
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
    let filterDate: string | null | undefined = lastAdminNote
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
        endDate: contractEndDate,
        contractor: intake.contract.contractor || null,
        vehicle: intake.contract.vehicle || null
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
