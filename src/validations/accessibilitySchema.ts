// Validations for the Accessibility/508 process
import * as Yup from 'yup';

const accessibilitySchema = {
  requestForm: Yup.object().shape({
    // Don't need to validate businessOwner name or component
    requestName: Yup.string().required("Tell us your request's name")
  })
};

export default accessibilitySchema;
