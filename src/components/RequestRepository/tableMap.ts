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

// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

export interface SystemIntakeForTable extends SystemIntakeForCsv {
  requesterNameAndComponent: string;
  lastAdminNote: SystemIntakeNote | null;
}

const getLastAdminNote = (notes: SystemIntakeForCsv['notes']) => {
  if (notes.length === 0) return null;

  const sortedNotes = sortBy(notes, 'createdAt');

  return sortedNotes[0];
};

const tableMap = (
  tableData: SystemIntakeForCsv[],
  t: TFunction
): SystemIntakeForTable[] => {
  return tableData.map((intake: SystemIntakeForCsv) => {
    // const statusEnum = intake.status;
    // let statusTranslation = '';

    // // Translating status
    // if (statusEnum === 'LCID_ISSUED') {
    //   // if status is LCID_ISSUED, translate from enum to i18n and append LCID
    //   statusTranslation = `${t(`intake:statusMap.${statusEnum}`)}: ${
    //     intake.lcid
    //   }`;
    // } else {
    //   // if not just translate from enum to i18n
    //   statusTranslation = t(`intake:statusMap.${statusEnum}`);
    // }

    /** Display both the requester name and the acronym of their component */
    const requesterNameAndComponent = getPersonNameAndComponentAcronym(
      intake.requester.name,
      intake.requester.component
    );

    let { state } = intake;
    if (intake.status === SystemIntakeStatus.LCID_ISSUED) {
      state = SystemIntakeState.CLOSED;
    }

    // Override all applicable fields in intake to use i18n translations
    return {
      ...intake,
      requesterNameAndComponent,
      // status: statusTranslation,
      state,
      lastAdminNote: getLastAdminNote(intake.notes)
    };
  });
};

export default tableMap;
