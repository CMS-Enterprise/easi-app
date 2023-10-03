import { TFunction } from 'i18next';
import { sortBy } from 'lodash';

import {
  GetSystemIntakesTable_systemIntakes as SystemIntake,
  GetSystemIntakesTable_systemIntakes_notes as AdminNote
} from 'queries/types/GetSystemIntakesTable';
import {
  SystemIntakeState,
  SystemIntakeStatus
} from 'types/graphql-global-types';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import { translateStatus } from 'utils/systemIntake';

// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

export interface SystemIntakeForTable extends Omit<SystemIntake, 'status'> {
  /** String with requester name and component acronym */
  requesterNameAndComponent: string;
  /** Translated status string */
  status: string;
  /** Filter date for portfolio update report */
  filterDate: string | null;
  lastAdminNote: AdminNote | null;
}

const getLastAdminNote = (notes: AdminNote[]): AdminNote | null => {
  if (notes.length === 0) return null;

  const sortedNotes = sortBy(notes, 'createdAt');
  return sortedNotes[0];
};

/** Returns array of system intakes formatted for request table and CSV exports */
const tableMap = (
  tableData: SystemIntake[],
  t: TFunction
): SystemIntakeForTable[] => {
  return tableData.map((intake: SystemIntake) => {
    const requesterNameAndComponent = getPersonNameAndComponentAcronym(
      intake.requester.name,
      intake.requester.component
    );

    /**
     * Fix for handling legacy intakes once IT Gov v2 is released
     * Sets intake state to CLOSED if status is LCID_ISSUED
     */
    let { state } = intake;
    if (intake.status === SystemIntakeStatus.LCID_ISSUED) {
      state = SystemIntakeState.CLOSED;
    }

    const lastAdminNote = getLastAdminNote(intake.notes);

    /** Filter date for portfolio update report - defaults to last admin note date */
    let filterDate: string | null = lastAdminNote
      ? lastAdminNote.createdAt
      : null;

    // If no admin notes, set `filterDate` to last admin action date
    if (!filterDate) {
      const sortedActions = sortBy(intake.actions, 'createdAt');
      filterDate = sortedActions.length > 0 ? sortedActions[0].createdAt : null;
    }

    // Override all applicable fields in intake to use i18n translations
    return {
      ...intake,
      requesterNameAndComponent,
      status: translateStatus(intake.status, intake.lcid),
      state,
      lastAdminNote,
      filterDate
    };
  });
};

export default tableMap;
