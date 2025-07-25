import { FormattedContacts } from 'types/systemIntake';

export const initialContactDetails = {
  id: '',
  euaUserId: '',
  systemIntakeId: '',
  component: '',
  role: '',
  commonName: '',
  email: ''
};

export const initialContactsObject: FormattedContacts = {
  requester: { ...initialContactDetails, role: 'Requester' },
  businessOwner: { ...initialContactDetails, role: 'Business Owner' },
  productManager: { ...initialContactDetails, role: 'Product Manager' },
  additionalContacts: []
};
