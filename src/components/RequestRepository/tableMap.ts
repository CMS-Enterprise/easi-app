import { TFunction } from 'i18next';
import { sortBy } from 'lodash';

import {
  SystemIntakeForCsv,
  SystemIntakeForCsv_notes as SystemIntakeNote
} from 'queries/types/SystemIntakeForCsv';
import {
  SystemIntakeState,
  SystemIntakeStatus
} from 'types/graphql-global-types';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import { translateStatus } from 'utils/systemIntake';

// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

export interface SystemIntakeForTable
  extends Omit<SystemIntakeForCsv, 'status'> {
  requesterNameAndComponent: string;
  lastAdminNote: SystemIntakeNote | null;
  status: string;
  filterDate: string | null;
}

const getLastAdminNote = (
  notes: SystemIntakeForCsv['notes']
): SystemIntakeNote | null => {
  if (notes.length === 0) return null;

  const sortedNotes = sortBy(notes, 'createdAt');
  return sortedNotes[0];
};

const tableMap = (
  tableData: SystemIntakeForCsv[],
  t: TFunction
): SystemIntakeForTable[] => {
  return tableData.map((intake: SystemIntakeForCsv) => {
    /** Display both the requester name and the acronym of their component */
    const requesterNameAndComponent = getPersonNameAndComponentAcronym(
      intake.requester.name,
      intake.requester.component
    );

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
