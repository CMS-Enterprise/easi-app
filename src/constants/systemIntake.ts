import { GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact } from 'queries/types/GetSystemIntakeContacts';
import { FormattedContacts } from 'types/systemIntake';

export const initialContactDetails = {
  id: '',
  euaUserId: '',
  systemIntakeId: '',
  component: '',
  role: '',
  commonName: '',
  email: ''
} as AugmentedSystemIntakeContact;

export const initialContactsObject: FormattedContacts = {
  businessOwner: { ...initialContactDetails, role: 'Business Owner' },
  productManager: { ...initialContactDetails, role: 'Product Manager' },
  isso: { ...initialContactDetails, role: 'ISSO' },
  additionalContacts: []
};
