// Data for the Accessibility/508 process
import {
  AccessibilityRequestForm,
  AccessibilityRequestFormCedar
} from 'types/accessibility';

// eslint-disable-next-line
export const initialAccessibilityRequestFormData: AccessibilityRequestForm = {
  intakeId: '',
  businessOwner: {
    name: '',
    component: ''
  },
  requestName: ''
};

export const initialAccessibilityRequestFormDataCedar: AccessibilityRequestFormCedar = {
  cedarId: '',
  requestName: ''
};
