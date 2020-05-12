import * as Yup from 'yup';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';

const governanceTeamNames = cmsGovernanceTeams.map(team => team.value);
const SystemIntakeValidationSchema: any = {
  contactDetails: Yup.object().shape({
    requester: Yup.object().shape({
      name: Yup.string().required('Enter a name for this request'),
      component: Yup.string().required("Select the Requester's component")
    }),
    bidnessOwner: Yup.object().shape({
      name: Yup.string().required("Enter the Bidness or Product Owner's name"),
      component: Yup.string().required('Select a Bidness Owner Component')
    }),
    productManager: Yup.object().shape({
      name: Yup.string().required(
        'Enter the CMS Project/Product Manager or Lead name'
      ),
      component: Yup.string().required(
        'Select a project/ product manager, or Lead Component'
      )
    }),
    isso: Yup.object().shape({
      isPresent: Yup.boolean()
        .nullable()
        .required('Select Yes or No to indicate if you have an ISSO'),
      name: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required('Tell us the name of your ISSO')
      })
    }),
    governanceTeams: Yup.object().shape({
      isPresent: Yup.boolean()
        .nullable()
        .required('Select if you are working with any teams'),
      teams: Yup.array().when('isPresent', {
        is: true,
        then: Yup.array()
          .min(1, 'Mark all teams you are currently collaborating with')
          .of(
            Yup.object().shape({
              name: Yup.string().oneOf(governanceTeamNames),
              collaborator: Yup.string()
                .when('name', {
                  is: 'Technical Review Board',
                  then: Yup.string().required(
                    "Tell us the name of the person you've been working with from the Technical Review Board"
                  )
                })
                .when('name', {
                  is: "OIT's Security and Privacy Group",
                  then: Yup.string().required(
                    "Tell us the name of the person you've been working with from OIT's Security and Privacy Group"
                  )
                })
                .when('name', {
                  is: 'Enterprise Architecture',
                  then: Yup.string().required(
                    "Tell us the name of the person you've been working with from Enterprise Architecture"
                  )
                })
            })
          )
      })
    })
  }),
  requestDetails: Yup.object().shape({
    requestName: Yup.string().required('Enter the Project Name'),
    bidnessNeed: Yup.string().required('Tell us about your request'),
    bidnessSolution: Yup.string().required(
      'Tell us how you think of solving your bidness need'
    ),
    needsEaSupport: Yup.boolean()
      .nullable()
      .required('Tell us if you need Enterprise Architecture (EA) support'),
    currentStage: Yup.string().required('Tell us where you are in the process'),
    hasContract: Yup.string().required('Tell us about your contract situation'),
    fundingSource: Yup.object().shape({
      isFunded: Yup.boolean()
        .nullable()
        .required('Select Yes or No to indicate if you have funding'),
      fundingNumber: Yup.string().when('isFunded', {
        is: true,
        then: Yup.string()
          .length(6, 'Funding number must be exactly 6 digits')
          .matches(/^\d+$/, 'Fuding number can only contain digits')
          .required(
            'Tell us your funding number. This is a six digit number and starts with 00'
          )
      })
    })
  })
};

export default SystemIntakeValidationSchema;
