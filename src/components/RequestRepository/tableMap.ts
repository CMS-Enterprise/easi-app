import { TFunction } from 'i18next';

import { SystemIntakeForCsv } from 'queries/types/SystemIntakeForCsv';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import { translateRequestType } from 'utils/systemIntake';

// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

const tableMap = (tableData: SystemIntakeForCsv[], t: TFunction) => {
  return tableData.map((intake: SystemIntakeForCsv) => {
    const statusEnum = intake.status;
    let statusTranslation = '';

    // Translating status
    if (statusEnum === 'LCID_ISSUED') {
      // if status is LCID_ISSUED, translate from enum to i18n and append LCID
      statusTranslation = `${t(`intake:statusMap.${statusEnum}`)}: ${
        intake.lcid
      }`;
    } else {
      // if not just translate from enum to i18n
      statusTranslation = t(`intake:statusMap.${statusEnum}`);
    }

    /** Display both the requester name and the acronym of their component */
    const requesterNameAndComponent = getPersonNameAndComponentAcronym(
      intake.requester.name,
      intake.requester.component
    );

    // Override all applicable fields in intake to use i18n translations
    return {
      ...intake,
      requesterNameAndComponent,
      status: statusTranslation,
      requestType: translateRequestType(intake.requestType)
    };
  });
};

export default tableMap;
