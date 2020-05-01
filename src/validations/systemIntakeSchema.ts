import * as Yup from 'yup';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';

const governanceTeamNames = cmsGovernanceTeams.map(team => team.value);
const SystemIntakeValidationSchema: any = {
  contactDetails: Yup.object().shape({
    requester: Yup.object().shape({
      name: Yup.string().required("Enter the Requester's name"),
      component: Yup.string().required("Enter the Requester's component")
    }),
    businessOwner: Yup.object().shape({
      name: Yup.string().required("Enter the Business or Product Owner's name"),
      component: Yup.string().required(
        "Enter the Business or Product Owner's component"
      )
    }),
    productManager: Yup.object().shape({
      name: Yup.string().required(
        "Enter the CMS Product/Project Manager, or Lead's Name"
      ),
      component: Yup.string().required(
        "Enter the CMS Product/Project Manager, or Lead's component"
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
    projectName: Yup.string().required('Enter the Project Name'),
    fundingSource: Yup.object().shape({
      isFunded: Yup.boolean()
        .nullable()
        .required('Select Yes or No to indicate if you have funding'),
      fundingNumber: Yup.string().when('isFunded', {
        is: true,
        then: Yup.string()
          .length(6, 'Funding number must be exactly 6 digits')
          .matches(/^\d+$/, 'Fuding number can only contain digits')
          .required('Tell us your six digit funding number')
      })
    }),
    businessNeed: Yup.string().required('Tell us about your business need'),
    businessSolution: Yup.string().required(
      'Tell us how you think of solving your business need'
    ),
    currentStage: Yup.string().required('Tell us where you are in the process'),
    needsEaSupport: Yup.boolean()
      .nullable()
      .required('Tell us if you need Enterprise Architecture (EA) support'),
    hasContract: Yup.string().required('Tell us about your contract situation')
  })
};

export default SystemIntakeValidationSchema;
