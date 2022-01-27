import { TFunction } from 'i18next';

import { SystemIntakeForm } from 'types/systemIntake';
import {
  getAcronymForComponent,
  translateRequestType
} from 'utils/systemIntake';

// Here is where the data can be modified and used appropriately for sorting.
// Modifed data can then be configured with JSX components in column cell configuration

const tableMap = (tableData: SystemIntakeForm[], t: TFunction) => {
  return tableData.map((intake: SystemIntakeForm) => {
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

    // Display both the requester name and the acronym of their component
    // TODO: might be better to just save the component's acronym in the intake?
    const requester = `${intake.requester.name}, ${getAcronymForComponent(
      intake.requester.component
    )}`;

    const adminLead = intake.adminLead
      ? intake.adminLead
      : t('governanceReviewTeam:adminLeads.notAssigned');

    const grtDate = intake.grtDate
      ? intake.grtDate
      : t('requestRepository.table.addDate');

    const grbDate = intake.grbDate
      ? intake.grbDate
      : t('requestRepository.table.addDate');

    // Override all applicable fields in intake to use i18n translations
    return {
      ...intake,
      requester,
      adminLead,
      grtDate,
      grbDate,
      status: statusTranslation,
      requestType: translateRequestType(intake.requestType)
    };
  });
};

export default tableMap;
