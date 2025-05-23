import * as Yup from 'yup';

const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const fiscalYearCosts = Yup.object()
  .shape({
    year1: Yup.string(),
    year2: Yup.string(),
    year3: Yup.string(),
    year4: Yup.string(),
    year5: Yup.string()
  })
  .test('lifecycleCosts', (years, phase) => {
    const costs = Object.values(years);
    const phaseLabel: string = phase.parent.label;

    const hasEmptyCost = costs.some(cost => !cost);

    return (
      !hasEmptyCost ||
      phase.createError({
        message: `Please enter all ${phaseLabel} estimated lifecycle costs`,
        path: phase.path
      })
    );
  });

const relatedCostPhase = Yup.object().shape({
  isPresent: Yup.boolean(),
  years: Yup.object().when('isPresent', {
    is: true,
    then: fiscalYearCosts
  })
});

const lifecycleCostsSchema = Yup.object().shape({
  // Required lifecycle cost categories
  development: Yup.object().shape({
    years: fiscalYearCosts
  }),
  operationsMaintenance: Yup.object().shape({
    years: fiscalYearCosts
  }),
  // Optional related costs
  helpDesk: relatedCostPhase,
  software: relatedCostPhase,
  planning: relatedCostPhase,
  infrastructure: relatedCostPhase,
  oit: relatedCostPhase,
  other: relatedCostPhase
});

const finalSolutionSchema = (solutionType: string) =>
  Yup.object().shape({
    title: Yup.string()
      .trim()
      .required(`Enter a title for the ${solutionType} solution`),
    summary: Yup.string()
      .trim()
      .required(`Tell us about the ${solutionType} solution`),
    acquisitionApproach: Yup.string()
      .trim()
      .required(
        `Tell us about the acquisition approach for the ${solutionType} solution`
      ),
    security: Yup.object().shape({
      isApproved: Yup.boolean()
        .nullable()
        .required(
          `Tell us whether the ${solutionType} solution was approved by IT Security for use at CMS`
        ),
      isBeingReviewed: Yup.string()
        .nullable()
        .when('isApproved', {
          is: false,
          then: Yup.string().required(
            `Tell us whether the ${solutionType} solution is in the process of receiving approval`
          )
        })
    }),
    hosting: Yup.object().shape({
      type: Yup.string().required(
        `Tell us how ${solutionType} solution will be hosted`
      ),
      location: Yup.string()
        .when('type', {
          is: 'cloud',
          then: Yup.string()
            .trim()
            .required(`Tell us where ${solutionType} solution will be hosted`)
        })
        .when('type', {
          is: 'dataCenter',
          then: Yup.string()
            .trim()
            .required(`Tell us where ${solutionType} solution will be hosted`)
        }),
      cloudServiceType: Yup.string().when('type', {
        is: 'cloud',
        then: Yup.string()
          .trim()
          .required(
            `Tell us about the cloud service that will be used for the ${solutionType} solution`
          )
      })
    }),
    hasUserInterface: Yup.string().required(
      `Tell us whether the ${solutionType} solution will have user interface`
    ),
    pros: Yup.string()
      .trim()
      .required(`Tell us about the pros of the ${solutionType} solution`),
    cons: Yup.string()
      .trim()
      .required(`Tell us about the cons of the ${solutionType} solution`),
    estimatedLifecycleCost: lifecycleCostsSchema,
    costSavings: Yup.string()
      .trim()
      .required(
        `Tell us about the cost savings or avoidance associated with the ${solutionType} solution`
      )
  });

export const BusinessCaseFinalValidationSchema = {
  generalRequestInfo: Yup.object().shape({
    requestName: Yup.string().trim().required('Enter the Project name'),
    requester: Yup.object().shape({
      name: Yup.string().trim().required("Enter the Requester's name"),
      phoneNumber: Yup.string()
        .trim()
        .matches(
          phoneNumberRegex,
          'Enter the requester’s phone number like 1234567890 or 123-456-7890'
        )
        .required(
          'Enter the requester’s phone number like 1234567890 or 123-456-7890'
        )
    }),
    businessOwner: Yup.object().shape({
      name: Yup.string().trim().required("Enter the Business Owner's name")
    })
  }),
  requestDescription: Yup.object().shape({
    businessNeed: Yup.string()
      .trim()
      .required('Tell us what the business or user need is'),
    currentSolutionSummary: Yup.string()
      .trim()
      .required('Give us a summary of the current solution'),
    cmsBenefit: Yup.string()
      .trim()
      .required('Tell us how CMS will benefit from this effort'),
    priorityAlignment: Yup.string()
      .trim()
      .required(
        'Tell us how this effort aligns with organizational priorities'
      ),
    successIndicators: Yup.string()
      .trim()
      .required(
        'Tell us how you will determine whether or not this effort is successful'
      )
  }),
  preferredSolution: finalSolutionSchema('Preferred Solution'),
  alternativeA: finalSolutionSchema('Alternative A'),
  alternativeB: finalSolutionSchema('Alternative B')
};

// We don't validate much when a Business Case is in draft
// This mostly empty validation makes it easier to switch validations in the form code
export const BusinessCaseDraftValidationSchema = {
  generalRequestInfo: Yup.object().shape({
    requester: Yup.object().shape({
      phoneNumber: Yup.string().matches(
        phoneNumberRegex,
        'Enter the requester’s phone number like 1234567890 or 123-456-7890'
      )
    })
  }),
  requestDescription: Yup.object().shape({}),
  alternativeAnalysis: Yup.object().shape({}),
  preferredSolution: Yup.object().shape({}),
  alternativeA: Yup.object().shape({}),
  alternativeB: Yup.object().shape({})
};

export const getAlternativeAnalysisSchema = (
  isFinal: boolean,
  alternativeBProvided: boolean
) =>
  Yup.object().shape({
    preferredSolution: Yup.object().test(
      'is-complete',
      'Please finish filling out the Preferred Solution',
      value => {
        if (!isFinal) return true; // Skip validation if not final
        try {
          finalSolutionSchema('Preferred Solution').validateSync(value, {
            abortEarly: false
          });
          return true;
        } catch {
          return false;
        }
      }
    ),
    alternativeA: Yup.object().test(
      'is-complete',
      'Please finish filling out Alternative A',
      value => {
        if (!isFinal) return true; // Skip validation if not final
        try {
          finalSolutionSchema('Alternative A').validateSync(value, {
            abortEarly: false
          });
          return true;
        } catch {
          return false;
        }
      }
    ),
    alternativeB: alternativeBProvided
      ? Yup.object().test(
          'is-complete',
          'Please finish filling out Alternative B',
          value => {
            if (!isFinal) return true; // Skip validation if not final
            try {
              finalSolutionSchema('Alternative B').validateSync(value, {
                abortEarly: false
              });
              return true;
            } catch {
              return false;
            }
          }
        )
      : Yup.object()
  });

/**
 * Returns the validation schema for a single solution
 */
export const getSingleSolutionSchema = (
  isFinal: boolean,
  solutionType: 'preferredSolution' | 'alternativeA' | 'alternativeB'
) => {
  return Yup.object({
    [solutionType]: BusinessCaseSchema(isFinal)[solutionType]
  });
};

/** Returns Business Case schema based on whether final or draft */
export const BusinessCaseSchema = (isFinal: boolean) =>
  isFinal
    ? BusinessCaseFinalValidationSchema
    : BusinessCaseDraftValidationSchema;
