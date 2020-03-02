import * as Yup from 'yup';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';

const governanceTeamNames = cmsGovernanceTeams.map(team => team.value);
const SystemIntakeValidationSchema: any = {
  1: Yup.object().shape({
    requestor: Yup.object().shape({
      name: Yup.string().required("Enter the Requestor's name"),
      component: Yup.string().required("Enter the Requestor's component")
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
              collaborator: Yup.string().required(
                "Tell us the name of the person you've been working with"
              )
            })
          )
      })
    })
  }),
  2: {}
};

export default SystemIntakeValidationSchema;
