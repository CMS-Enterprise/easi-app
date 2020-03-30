import * as Yup from 'yup';

//
const phoneNumberRegex = /( *-*[0-9] *?){10,}/;
const BusinessCaseValidationSchema = {
  generalProjectInfo: Yup.object().shape({
    projectName: Yup.string().required('Enter the Project Name'),
    requestor: Yup.object().shape({
      name: Yup.string().required("Enter the Requestor's name"),
      phoneNumber: Yup.string()
        .matches(
          phoneNumberRegex,
          "The phone number doesn't have enough digits. Check and update it."
        )
        .required(
          'Enter the Requestor’s phone number like 123456789 or 123-456-789'
        )
    }),
    businessOwner: Yup.object().shape({
      name: Yup.string().required("Enter the Business Owner's name")
    })
  }),
  projectDescription: Yup.object().shape({})
};

export default BusinessCaseValidationSchema;
