import { DateTime } from 'luxon';
import * as Yup from 'yup';

import { FormattedFundingSource } from 'components/FundingSources';
import { SystemIntakeDocumentCommonType } from 'types/graphql-global-types';

const govTeam = (name: string) =>
  Yup.object().shape({
    isPresent: Yup.boolean(),
    collaborator: Yup.string().when('isPresent', {
      is: true,
      then: Yup.string().required(
        `Tell us the name of the person you've been working with from the ${name}`
      )
    })
  });

const governanceTeams = Yup.object().shape({
  isPresent: Yup.boolean()
    .nullable()
    .required('Select if you are working with any teams'),
  teams: Yup.object()
    .shape({
      technicalReviewBoard: govTeam('Technical Review Board'),
      securityPrivacy: govTeam("OIT's Security and Privacy Group"),
      enterpriseArchitecture: govTeam('Enterprise Architecture')
    })
    .test(
      'min',
      'Mark all teams you are currently collaborating with',
      (teams, context) => {
        const { isPresent } = context.parent;
        return isPresent
          ? Object.values(teams).some(team => team.isPresent)
          : true;
      }
    )
});

const SystemIntakeValidationSchema = {
  contactDetails: Yup.object().shape({
    requester: Yup.object().shape({
      commonName: Yup.string().trim().required('Enter a name for this request'),
      component: Yup.string().required("Select the Requester's component")
    }),
    businessOwner: Yup.object().shape({
      commonName: Yup.string()
        .trim()
        .required("Enter the Business or Product Owner's name"),
      component: Yup.string().required('Select a Business Owner Component')
    }),
    productManager: Yup.object().shape({
      commonName: Yup.string()
        .trim()
        .required('Enter the CMS Project/Product Manager or Lead name'),
      component: Yup.string().required(
        'Select a Project/Product Manager or Lead Component'
      )
    }),
    isso: Yup.object().shape({
      isPresent: Yup.boolean()
        .nullable()
        .required('Select Yes or No to indicate if you have an ISSO'),
      commonName: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().trim().required('Tell us the name of your ISSO')
      }),
      component: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required('Select an ISSO component')
      })
    }),
    governanceTeams
  }),
  requestDetails: Yup.object().shape({
    requestName: Yup.string()
      .trim()
      .required('Enter the Contract/Request Title'),
    businessNeed: Yup.string().trim().required('Tell us about your request'),
    businessSolution: Yup.string()
      .trim()
      .required('Tell us how you think of solving your business need'),
    currentStage: Yup.string().required('Tell us where you are in the process'),
    usesAiTech: Yup.boolean()
      .nullable()
      .required('Tell us if your request involves AI technologies'),
    needsEaSupport: Yup.boolean()
      .nullable()
      .required('Tell us if you need Enterprise Architecture (EA) support'),
    hasUiChanges: Yup.boolean()
      .nullable()
      .required(
        'Tell us if your request includes an interface component or changes'
      )
  }),
  contractDetails: Yup.object().shape({
    annualSpending: Yup.object().shape({
      currentAnnualSpending: Yup.string().required(
        'Tell us what the current annual spending for the contract'
      ),
      currentAnnualSpendingITPortion: Yup.string().required(
        'Tell us what portion (% of amount) of the current annual spending is IT'
      ),
      plannedYearOneSpending: Yup.string().required(
        'Tell us the planned annual spending of the first year of the new contract?'
      ),
      plannedYearOneSpendingITPortion: Yup.string().required(
        'Tell us what portion (% of amount) planned annual spending of the first year of the new contract is IT?'
      )
    }),
    contract: Yup.object().shape({
      hasContract: Yup.string()
        .nullable()
        .required('Tell us whether you have a contract to support this effort'),
      contractor: Yup.string().when('hasContract', {
        is: (val: string) => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.string()
          .trim()
          .required('Tell us whether you have selected a contractor(s)')
      }),
      numbers: Yup.string().when('hasContract', {
        is: (val: string) => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.string().trim().required('Tell us about the contract number')
      }),
      startDate: Yup.mixed().when('hasContract', {
        is: (val: string) => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.object().shape({
          month: Yup.string()
            .trim()
            .matches(/\d{1,2}/, 'Please enter a valid start month')
            .required('Tell us the contract start month'),
          day: Yup.string()
            .trim()
            .matches(/\d{1,2}/, 'Please enter a valid start day')
            .required('Tell us the contract start day'),
          year: Yup.string()
            .trim()
            .matches(/\d{4}/, 'Please enter a valid start year')
            .required('Tell us the contract start year'),
          validDate: Yup.string().when(['month', 'day', 'year'], {
            is: (month: string, day: string, year: string) => {
              if (
                DateTime.fromObject({
                  month: Number(month) || 0,
                  day: Number(day) || 0,
                  year: Number(year) || 0
                }).isValid
              ) {
                return true;
              }
              return false;
            },
            otherwise: Yup.string().test(
              'validStartDate',
              'Period of performance date: Please enter a valid start date',
              () => false
            )
          })
        })
      }),
      endDate: Yup.mixed().when('hasContract', {
        is: (val: string) => ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(val),
        then: Yup.object().shape({
          month: Yup.string()
            .trim()
            .matches(/\d{1,2}/, 'Please enter a valid end month')
            .required('Tell us the contract end month'),
          day: Yup.string()
            .trim()
            .matches(/\d{1,2}/, 'Please enter a valid end day')
            .required('Tell us the contract end day'),
          year: Yup.string()
            .trim()
            .matches(/\d{4}/, 'Please enter a valid end year')
            .required('Tell us the contract end year'),
          validDate: Yup.string().when(['month', 'day', 'year'], {
            is: (month: string, day: string, year: string) => {
              if (
                DateTime.fromObject({
                  month: Number(month) || 0,
                  day: Number(day) || 0,
                  year: Number(year) || 0
                }).isValid
              ) {
                return true;
              }
              return false;
            },
            otherwise: Yup.string().test(
              'validStartDate',
              'Period of performance date: Please enter a valid end date',
              () => false
            )
          })
        })
      })
    })
  }),
  requestType: Yup.object().shape({
    requestType: Yup.string()
      .trim()
      .required('Tell us what your request is for')
  })
};

export default SystemIntakeValidationSchema;

export const FundingSourcesValidationSchema = Yup.object().shape({
  fundingSources: Yup.array().of(
    Yup.object({
      id: Yup.string(),
      fundingNumber: Yup.string()
        .trim()
        .required('Funding number must be exactly 6 digits')
        .length(6, 'Funding number must be exactly 6 digits')
        .matches(/^\d+$/, 'Funding number can only contain digits'),
      sources: Yup.array().of(Yup.string()).min(1, 'Select a funding source')
    }).test('is-unique', 'Must be unique', (value, context) => {
      const fundingNumbers: string[] = context.parent
        .filter((source: FormattedFundingSource) => source.id !== value.id)
        .map((source: FormattedFundingSource) => source.fundingNumber);

      const isUnique = !fundingNumbers.includes(value?.fundingNumber!);

      return (
        isUnique ||
        context.createError({
          path: `${context.path}.fundingNumber`,
          message: 'Funding number must be unique'
        })
      );
    })
  )
});

export const DateValidationSchema: any = Yup.object().shape(
  {
    grtDateDay: Yup.string().when(['grtDateMonth', 'grtDateYear'], {
      is: (grtDateMonth: string, grtDateYear: string) => {
        return grtDateMonth || grtDateYear;
      },
      then: Yup.string().trim().required('The day is required')
    }),
    grtDateMonth: Yup.string().when(['grtDateDay', 'grtDateYear'], {
      is: (grtDateDay: string, grtDateYear: string) => {
        return grtDateDay || grtDateYear;
      },
      then: Yup.string().trim().required('The month is required')
    }),
    grtDateYear: Yup.string().when(['grtDateDay', 'grtDateMonth'], {
      is: (grtDateDay: string, grtDateMonth: string) => {
        return grtDateDay || grtDateMonth;
      },
      then: Yup.string().trim().required('The year is required')
    }),
    validGrtDate: Yup.string().when(
      ['grtDateDay', 'grtDateMonth', 'grtDateYear'],
      {
        is: (grtDateDay: string, grtDateMonth: string, grtDateYear: string) => {
          // Only check for a valid date if monday, date, and year a filled
          if (grtDateDay && grtDateMonth && grtDateYear) {
            // If the date is valid, it passes the validation
            if (
              DateTime.fromObject({
                month: Number(grtDateMonth) || 0,
                day: Number(grtDateDay) || 0,
                year: Number(grtDateYear) || 0
              }).isValid
            ) {
              return true;
            }
            return false;
          }
          // If month, day, and year aren't ALL filled, don't run the validation
          return true;
        },
        otherwise: Yup.string().test(
          'validateGrtDate',
          'GRT Date: Please enter a valid date',
          () => false
        )
      }
    ),
    grbDateDay: Yup.string().when(['grbDateMonth', 'grbDateYear'], {
      is: (grbDateMonth: string, grbDateYear: string) => {
        return grbDateMonth || grbDateYear;
      },
      then: Yup.string().trim().required('The day is required')
    }),
    grbDateMonth: Yup.string().when(['grbDateDay', 'grbDateYear'], {
      is: (grbDateDay: string, grbDateYear: string) => {
        return grbDateDay || grbDateYear;
      },
      then: Yup.string().trim().required('The month is required')
    }),
    grbDateYear: Yup.string().when(['grbDateDay', 'grbDateMonth'], {
      is: (grbDateDay: string, grbDateMonth: string) => {
        return grbDateDay || grbDateMonth;
      },
      then: Yup.string().trim().required('The year is required')
    }),
    validGrbDate: Yup.string().when(
      ['grbDateDay', 'grbDateMonth', 'grbDateYear'],
      {
        is: (grbDateDay: string, grbDateMonth: string, grbDateYear: string) => {
          // Only check for a valid date if monday, date, and year a filled
          if (grbDateDay && grbDateMonth && grbDateYear) {
            // If the date is valid, it passes the validation
            if (
              DateTime.fromObject({
                month: Number(grbDateMonth) || 0,
                day: Number(grbDateDay) || 0,
                year: Number(grbDateYear) || 0
              }).isValid
            ) {
              return true;
            }
            return false;
          }
          // If month, day, and year aren't ALL filled, don't run the validation
          return true;
        },
        otherwise: Yup.string().test(
          'validateGrbDate',
          'GRB Date: Please enter a valid date',
          () => false
        )
      }
    )
  },
  [
    ['grtDateDay', 'grtDateMonth'],
    ['grtDateDay', 'grtDateYear'],
    ['grtDateMonth', 'grtDateYear'],
    ['grbDateDay', 'grbDateMonth'],
    ['grbDateDay', 'grbDateYear'],
    ['grbDateMonth', 'grbDateYear']
  ]
);

export const documentSchema = Yup.object({
  fileData: Yup.mixed().required(),
  documentType: Yup.mixed<SystemIntakeDocumentCommonType>()
    .oneOf(Object.values(SystemIntakeDocumentCommonType))
    .required(),
  otherTypeDescription: Yup.string().when('documentType', {
    is: 'OTHER',
    then: schema => schema.required()
  })
});
