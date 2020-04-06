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
  }),
  asIsSolution: Yup.object().shape({
    asIsSolution: Yup.object().shape({
      title: Yup.string().required('Enter a title for the "As is" solution'),
      summary: Yup.string().required('Tell us about the "As is" solution'),
      pros: Yup.string().required('Tell us about the pros of "As is" solution'),
      cons: Yup.string().required('Tell us about the cons of "As is" solution'),
      estimatedLifecycleCost: Yup.object().shape({
        year1: Yup.array().of(
          Yup.object().shape({
            phase: Yup.string().required('Select the type of phase for Year 1'),
            cost: Yup.string().required('Enter the cost for Year 1')
          })
        ),
        year2: Yup.array().of(
          Yup.object().shape({
            phase: Yup.string().required('Select the type of phase for Year 2'),
            cost: Yup.string().required('Enter the cost for Year 2')
          })
        ),
        year3: Yup.array().of(
          Yup.object().shape({
            phase: Yup.string().required('Select the type of phase for Year 3'),
            cost: Yup.string().required('Enter the cost for Year 3')
          })
        ),
        year4: Yup.array().of(
          Yup.object().shape({
            phase: Yup.string().required('Select the type of phase for Year 4'),
            cost: Yup.string().required('Enter the cost for Year 4')
          })
        ),
        year5: Yup.array().of(
          Yup.object().shape({
            phase: Yup.string().required('Select the type of phase for Year 5'),
            cost: Yup.string().required('Enter the cost for Year 5')
          })
        )
      }),
      costSavings: Yup.string().required(
        'Tell us about the cost savings or avoidance associated with this solution'
      )
    })
  })
};

export default BusinessCaseValidationSchema;
