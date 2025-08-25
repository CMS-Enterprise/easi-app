import { FormattedContacts } from 'types/systemIntake';

export const initialContactDetails = {
  id: '',
  euaUserId: '',
  systemIntakeId: '',
  component: '',
  roles: [],
  commonName: '',
  email: ''
};

export const initialContactsObject: FormattedContacts = {
  requester: { ...initialContactDetails, roles: ['Requester'] },
  businessOwner: { ...initialContactDetails, roles: ['Business Owner'] },
  productManager: { ...initialContactDetails, roles: ['Product Manager'] },
  additionalContacts: []
};
