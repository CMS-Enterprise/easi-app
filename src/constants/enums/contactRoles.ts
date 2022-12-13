import i18next from 'i18next';

import { PersonRole } from 'types/graphql-global-types';

const contactRoles = [
  {
    key: PersonRole.PRODUCT_OWNER,
    label: i18next.t('technicalAssistance:attendees.contactRoles.productOwner')
  },
  {
    key: PersonRole.SYSTEM_OWNER,
    label: i18next.t('technicalAssistance:attendees.contactRoles.systemOwner')
  },
  {
    key: PersonRole.SYSTEM_MAINTAINER,
    label: i18next.t(
      'technicalAssistance:attendees.contactRoles.systemMaintainer'
    )
  },
  {
    key: PersonRole.CONTRACT_OFFICE_RSREPRESENTATIVE,
    label: i18next.t('technicalAssistance:attendees.contactRoles.contractRep')
  },
  {
    key: PersonRole.CLOUD_NAVIGATOR,
    label: i18next.t(
      'technicalAssistance:attendees.contactRoles.cloudNavigator'
    )
  },
  {
    key: PersonRole.PRIVACY_ADVISOR,
    label: i18next.t(
      'technicalAssistance:attendees.contactRoles.privacyAdvisor'
    )
  },
  {
    key: PersonRole.CRA,
    label: i18next.t('technicalAssistance:attendees.contactRoles.cra')
  },
  {
    key: PersonRole.OTHER,
    label: i18next.t('technicalAssistance:attendees.contactRoles.other')
  },
  {
    key: PersonRole.UNKNOWN,
    label: i18next.t('technicalAssistance:attendees.contactRoles.unknown')
  }
] as const;

export default contactRoles;
