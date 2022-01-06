import { CMSOfficeAcronym } from 'constants/enums/cmsDivisionsAndOffices';
import { IconStatus } from 'types/iconStatus';

export interface SystemInfo {
  id: string;
  acronym: string;
  name: string;
  ownerName: string;
  ownerOffice: CMSOfficeAcronym;
  productionStatus: IconStatus; // TODO - this may not correspond to a field in CEDAR. maybe make it depend on ATO+508+TRB status?
  atoStatus: IconStatus;
  atoStatusText: string;
  section508Status: IconStatus;
  section508StatusText: string;
  trbStatus: IconStatus;
  trbStatusText: string;
}

export const mockSystemInfo: SystemInfo[] = [
  {
    id: '1',
    acronym: 'HAM',
    name: 'Happiness Achievement Module',
    ownerName: 'Jane Doe',
    ownerOffice: 'CMMI',
    productionStatus: 'success',
    atoStatus: 'success',
    atoStatusText: 'Good to go!',
    section508Status: 'success',
    section508StatusText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`,
    trbStatus: 'success',
    trbStatusText: 'Good to go!'
  },
  {
    id: '2',
    acronym: 'ZXC',
    name: 'XYZ789',
    ownerName: 'John Doe',
    ownerOffice: 'OIT',
    productionStatus: 'warning',
    atoStatus: 'warning',
    atoStatusText: 'Not yet compliant',
    section508Status: 'warning',
    section508StatusText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec `,
    trbStatus: 'warning',
    trbStatusText: 'Needs more microservices'
  },
  {
    id: '3',
    acronym: 'QWE',
    name: '8675309',
    ownerName: 'Jennifer Doe',
    ownerOffice: 'CCIIO',
    productionStatus: 'fail',
    atoStatus: 'fail',
    atoStatusText: 'Not yet authorized',
    section508Status: 'success',
    section508StatusText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. `,
    trbStatus: 'fail',
    trbStatusText: 'Hash and salt your passwords!'
  }
];

export interface CedarSystemBookMark {
  euaUserId: string;
  cedarSystemId: string;
}

export const mockBookmarkInfo: CedarSystemBookMark[] = [
  {
    euaUserId: 'A',
    cedarSystemId: '1'
  },
  {
    euaUserId: 'A',
    cedarSystemId: '2'
  },
  {
    euaUserId: 'A',
    cedarSystemId: '3'
  }
];
