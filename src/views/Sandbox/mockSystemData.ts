import { CMSOfficeAcronym } from 'constants/enums/cmsDivisionsAndOffices';
import { IconStatus } from 'types/iconStatus';

export interface SystemInfo {
  id: string;
  name: string;
  ownerName: string;
  ownerOffice: CMSOfficeAcronym;
  productionStatus: IconStatus;
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
    name: 'ABC123',
    ownerName: 'Jane Doe',
    ownerOffice: 'CMMI',
    productionStatus: 'success',
    atoStatus: 'success',
    atoStatusText: 'Good to go!',
    section508Status: 'success',
    section508StatusText: 'Good to go!',
    trbStatus: 'success',
    trbStatusText: 'Good to go!'
  },
  {
    id: '2',
    name: 'XYZ789',
    ownerName: 'John Doe',
    ownerOffice: 'OIT',
    productionStatus: 'warning',
    atoStatus: 'success',
    atoStatusText: 'Good to go!',
    section508Status: 'warning',
    section508StatusText: 'Not yet compliant',
    trbStatus: 'warning',
    trbStatusText: 'Needs more microservices'
  },
  {
    id: '3',
    name: '8675309',
    ownerName: 'Jennifer Doe',
    ownerOffice: 'CCIIO',
    productionStatus: 'fail',
    atoStatus: 'fail',
    atoStatusText: 'Not yet authorized',
    section508Status: 'success',
    section508StatusText: 'Good to go!',
    trbStatus: 'fail',
    trbStatusText: 'Hash and salt your passwords!'
  }
];
