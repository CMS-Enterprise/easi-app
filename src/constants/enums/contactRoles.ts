import { PersonRole } from 'types/graphql-global-types';

const contactRoles = [
  {
    key: PersonRole.PRODUCT_OWNER,
    label: 'Product Owner'
  },
  {
    key: PersonRole.SYSTEM_OWNER,
    label: 'System Owner'
  },
  {
    key: PersonRole.SYSTEM_MAINTAINER,
    label: 'System Maintainer'
  },
  {
    key: PersonRole.CONTRACT_OFFICE_RSREPRESENTATIVE,
    label: "Contracting Officer's Representative (COR)"
  },
  {
    key: PersonRole.CLOUD_NAVIGATOR,
    label: 'Cloud Navigator'
  },
  {
    key: PersonRole.PRIVACY_ADVISOR,
    label: 'Privacy Advisor'
  },
  {
    key: PersonRole.CRA,
    label: 'CRA'
  },
  {
    key: PersonRole.OTHER,
    label: 'Other'
  },
  {
    key: PersonRole.UNKNOWN,
    label: 'Unknown'
  }
] as const;

export default contactRoles;
