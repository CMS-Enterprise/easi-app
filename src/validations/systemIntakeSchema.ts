import * as Yup from 'yup';

import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';

const governanceTeamNames = cmsGovernanceTeams.map(team => team.value);
const SystemIntakeValidationSchema: any = {
  contactDetails: Yup.object().shape({
    requester: Yup.object().shape({
      name: Yup.string().required('Enter a name for this request'),
      component: Yup.string().required("Select the Requester's component")
    }),
    businessOwner: Yup.object().shape({
      name: Yup.string().required("Enter the Business or Product Owner's name"),
      component: Yup.string().required('Select a Business Owner Component')
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
    businessNeed: Yup.string().required('Tell us about your request'),
    businessSolution: Yup.string().required(
      'Tell us how you think of solving your business need'
    ),
    needsEaSupport: Yup.boolean()
      .nullable()
      .required('Tell us if you need Enterprise Architecture (EA) support')
  }),
  contractDetails: Yup.object().shape({
    currentStage: Yup.string().required('Tell us where you are in the process'),
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
      }),
      source: Yup.string().when('isFunded', {
        is: true,
        then: Yup.string().required('Tell us your funding source')
      })
    }),
    costs: Yup.object().shape({
      isExpectingIncrease: Yup.string().required(
        'Tell us whether you are expecting costs for this request to increase'
      ),
      expectedIncreaseAmount: Yup.string().when('isExpectingIncrease', {
        is: 'YES',
        then: Yup.string().required(
          'Tell us approximately how much do you expect the cost to increase'
        )
      })
    }),
    contract: Yup.object().shape({
      hasContract: Yup.string().required(
        'Tell us whether you have a contract to support this effort'
      ),
      contractor: Yup.string().when('hasContract', {
        is: val => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.string().required(
          'Tell us whether you have selected a contractor(s)'
        )
      }),
      vehicle: Yup.string().when('hasContract', {
        is: val => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.string().required('Tell us about the contract vehicle')
      }),
      startDate: Yup.mixed().when('hasContract', {
        is: val => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.object().shape({
          month: Yup.string().required('Tell us the contract start month'),
          year: Yup.string().required('Tell us the contract start year')
        })
      }),
      endDate: Yup.mixed().when('hasContract', {
        is: val => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.object().shape({
          month: Yup.string().required('Tell us the contract end month'),
          year: Yup.string().required('Tell us the contract end year')
        })
      })
    })
  }),
  requestType: Yup.object().shape({
    requestType: Yup.string().required('Tell us what your request is for')
  })
};

export default SystemIntakeValidationSchema;

export const DateValidationSchema: any = Yup.object().shape({
  grtDate: Yup.mixed().test({
    name: 'grtDate',
    // exclusive: true,
    // params: { ['grtDateDay', 'grtDateMonth', 'grtDateYear'] },
    message: 'Please enter a complete GRT date',
    test: ({
      grtDateDay,
      grtDateMonth,
      grtDateYear
    }: {
      grtDateDay: any;
      grtDateMonth: any;
      grtDateYear: any;
    }) => {
      console.log('grtDateDay ', grtDateDay);
      console.log('grtDateMonth ', grtDateMonth);
      console.log('grtDateYear ', grtDateYear);

      if (
        grtDateDay === undefined &&
        grtDateMonth === undefined &&
        grtDateYear === undefined
      ) {
        console.log('Got here A');
        return true;
      }

      if (
        grtDateDay !== undefined &&
        grtDateMonth !== undefined &&
        grtDateYear !== undefined
      ) {
        console.log('got here B');
        return true;
      }

      return false;
    }
  })
  // grtDateDay: Yup.number().when(['grtDateMonth', 'grtDateYear'], {
  //   is: (grtDateMonth: any, grtDateYear: any) => grtDateMonth || grtDateYear,
  //   then: (s: any) => s.required('The day is required')
  // }),
  // grtDateMonth: Yup.string().when(['grtDateDay', 'grtDateYear'], {
  //   is: (grtDateDay: any, grtDateYear: any) => grtDateDay || grtDateYear,
  //   then: (s: any) => s.required('The month is required')
  // }),
  // grtDateYear: Yup.string().when(['grtDateDay', 'grtDateMonth'], {
  //   is: true,
  //   then: (s: any) => s.required('The year is required')
  // })
});
