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

export const BusinessCaseFinalValidationSchema = {
  generalRequestInfo: Yup.object().shape({
    requestName: Yup.string().trim().required('Enter the Project Name'),
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
        'Tell us how you will determine whethere or not this effort is successful'
      )
  }),
  preferredSolution: Yup.object().shape({
    preferredSolution: Yup.object().shape({
      title: Yup.string()
        .trim()
        .required('Enter a title for the Preferred solution'),
      summary: Yup.string()
        .trim()
        .required('Tell us about the Preferred solution'),
      acquisitionApproach: Yup.string()
        .trim()
        .required(
          'Tell us about the acquisition approach for the Preferred solution'
        ),
      security: Yup.object().shape({
        isApproved: Yup.boolean()
          .nullable()
          .required(
            'Tell us whether for solution was approved by IT Security for use at CMS'
          ),
        isBeingReviewed: Yup.string()
          .nullable()
          .when('isApproved', {
            is: false,
            then: Yup.string().required(
              'Tell us whether your solution is in the process of receiving approval'
            )
          })
      }),
      hosting: Yup.object().shape({
        type: Yup.string().required(
          'Tell us how Preferred solution will be hosted'
        ),
        location: Yup.string()
          .when('type', {
            is: 'cloud',
            then: Yup.string()
              .trim()
              .required('Tell us where Preferred solution will be hosted')
          })
          .when('type', {
            is: 'dataCenter',
            then: Yup.string()
              .trim()
              .required('Tell us where Preferred solution will be hosted')
          }),
        cloudServiceType: Yup.string().when('type', {
          is: 'cloud',
          then: Yup.string()
            .trim()
            .required(
              'Tell us about the cloud service that will be used for the Preferred solution'
            )
        })
      }),
      hasUserInterface: Yup.string().required(
        'Tell us whether the Preferred solution will have user interface'
      ),
      pros: Yup.string()
        .trim()
        .required('Tell us about the pros of Preferred solution'),
      cons: Yup.string()
        .trim()
        .required('Tell us about the cons of Preferred solution'),
      estimatedLifecycleCost: lifecycleCostsSchema,
      costSavings: Yup.string()
        .trim()
        .required(
          'Tell us about the cost savings or avoidance associated with this solution'
        )
    })
  }),
  alternativeA: Yup.object().shape({
    alternativeA: Yup.object().shape({
      title: Yup.string()
        .trim()
        .required('Enter a title for the Alternative A solution'),
      summary: Yup.string()
        .trim()
        .required('Tell us about the Alternative A solution'),
      acquisitionApproach: Yup.string()
        .trim()
        .required(
          'Tell us about the acquisition approach for the Alternative A solution'
        ),
      security: Yup.object().shape({
        isApproved: Yup.boolean()
          .nullable()
          .required(
            'Tell us whether for solution was approved by IT Security for use at CMS'
          ),
        isBeingReviewed: Yup.string()
          .nullable()
          .when('isApproved', {
            is: false,
            then: Yup.string().required(
              'Tell us whether your solution is in the process of receiving approval'
            )
          })
      }),
      hosting: Yup.object().shape({
        type: Yup.string()
          .trim()
          .required('Tell us how Alternative A solution will be hosted'),
        location: Yup.string()
          .when('type', {
            is: 'cloud',
            then: Yup.string()
              .trim()
              .required('Tell us where Alternative A solution will be hosted')
          })
          .when('type', {
            is: 'dataCenter',
            then: Yup.string()
              .trim()
              .required('Tell us where Alternative A solution will be hosted')
          }),
        cloudServiceType: Yup.string().when('type', {
          is: 'cloud',
          then: Yup.string()
            .trim()
            .required(
              'Tell us about the cloud service that will be used for the Alternative A solution'
            )
        })
      }),
      hasUserInterface: Yup.string()
        .nullable()
        .required(
          'Tell us whether the Alternative A solution will have user interface'
        ),
      pros: Yup.string()
        .trim()
        .required('Tell us about the pros of Alternative A solution'),
      cons: Yup.string()
        .trim()
        .required('Tell us about the cons of Alternative A solution'),
      estimatedLifecycleCost: lifecycleCostsSchema,
      costSavings: Yup.string()
        .trim()
        .required(
          'Tell us about the cost savings or avoidance associated with this solution'
        )
    })
  }),
  alternativeB: Yup.object().shape({
    alternativeB: Yup.object().shape({
      title: Yup.string()
        .trim()
        .required('Enter a title for the Alternative B solution'),
      summary: Yup.string()
        .trim()
        .required('Tell us about the Alternative B solution'),
      acquisitionApproach: Yup.string()
        .trim()
        .required(
          'Tell us about the acquisition approach for the Alternative B solution'
        ),
      security: Yup.object().shape({
        isApproved: Yup.boolean()
          .nullable()
          .required(
            'Tell us whether for solution was approved by IT Security for use at CMS'
          ),
        isBeingReviewed: Yup.string()
          .nullable()
          .when('isApproved', {
            is: false,
            then: Yup.string().required(
              'Tell us whether your solution is in the process of receiving approval'
            )
          })
      }),
      hosting: Yup.object().shape({
        type: Yup.string().required(
          'Tell us how Alternative B solution will be hosted'
        ),
        location: Yup.string()
          .when('type', {
            is: 'cloud',
            then: Yup.string()
              .trim()
              .required('Tell us where Alternative B solution will be hosted')
          })
          .when('type', {
            is: 'dataCenter',
            then: Yup.string()
              .trim()
              .required('Tell us where Alternative B solution will be hosted')
          }),
        cloudServiceType: Yup.string().when('type', {
          is: 'cloud',
          then: Yup.string()
            .trim()
            .required(
              'Tell us about the cloud service that will be used for the Alternative B solution'
            )
        })
      }),
      hasUserInterface: Yup.string().required(
        'Tell us whether the Alternative B solution will have user interface'
      ),
      pros: Yup.string()
        .trim()
        .required('Tell us about the pros of Alternative B solution'),
      cons: Yup.string()
        .trim()
        .required('Tell us about the cons of Alternative B solution'),
      estimatedLifecycleCost: lifecycleCostsSchema,
      costSavings: Yup.string()
        .trim()
        .required(
          'Tell us about the cost savings or avoidance associated with this solution'
        )
    })
  })
};

// We don't validate much when a business case is in draft
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
  preferredSolution: Yup.object().shape({}),
  alternativeA: Yup.object().shape({}),
  alternativeB: Yup.object().shape({})
};

/** Returns business case schema based on whether final or draft */
export const BusinessCaseSchema = (isFinal: boolean) =>
  isFinal
    ? BusinessCaseFinalValidationSchema
    : BusinessCaseDraftValidationSchema;
