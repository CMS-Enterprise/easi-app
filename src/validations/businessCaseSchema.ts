import * as Yup from 'yup';

//
const phoneNumberRegex = /( *-*[0-9] *?){10,}/;
const BusinessCaseValidationSchema = {
  generalProjectInfo: Yup.object().shape({
    projectName: Yup.string().required('Enter the Project Name'),
    requester: Yup.object().shape({
      name: Yup.string().required("Enter the Requester's name"),
      phoneNumber: Yup.string()
        .matches(
          phoneNumberRegex,
          "The phone number doesn't have enough digits. Check and update it"
        )
        .required(
          'Enter the Requester’s phone number like 123456789 or 123-456-789'
        )
    }),
    businessOwner: Yup.object().shape({
      name: Yup.string().required("Enter the Business Owner's name")
    })
  }),
  projectDescription: Yup.object().shape({
    businessNeed: Yup.string().required(
      'Tell us what the business or user need is'
    ),
    cmsBenefit: Yup.string().required(
      'Tell us how CMS will benefit from this effort'
    ),
    priorityAlignment: Yup.string().required(
      'Tell us how this effort aligns with organizational priorities'
    ),
    successIndicators: Yup.string().required(
      'Tell us how you will determine whethere or not this effort is successful'
    )
  })
};

export default BusinessCaseValidationSchema;
