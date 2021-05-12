import * as Yup from 'yup';

//
const phoneNumberRegex = /( *-*[0-9] *?){10,}/;

const estimatedLifecycleCostSchema = Yup.object().shape({
  year1: Yup.object()
    .test(
      'requiredPhase',
      'Select at least one of: Phase, Operations and Maintenance, or Other',
      (value: any) => {
        if (
          value.development.isPresent ||
          value.operationsMaintenance.isPresent ||
          value.other.isPresent
        ) {
          return true;
        }
        return false;
      }
    )
    .shape({
      development: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required('Enter the development cost for Year 1')
        })
      }),
      operationsMaintenance: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required(
            'Enter the operations and maintenance cost for Year 1'
          )
        })
      }),
      other: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required('Enter the other cost for Year 1')
        })
      })
    }),
  year2: Yup.object()
    .test(
      'requiredPhase',
      'Select at least one of: Phase, Operations and Maintenance, or Other',
      (value: any) => {
        if (
          value.development.isPresent ||
          value.operationsMaintenance.isPresent ||
          value.other.isPresent
        ) {
          return true;
        }
        return false;
      }
    )
    .shape({
      development: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required('Enter the development cost for Year 2')
        })
      }),
      operationsMaintenance: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required(
            'Enter the operations and maintenance cost for Year 2'
          )
        })
      }),
      other: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required('Enter the other cost for Year 2')
        })
      })
    }),
  year3: Yup.object()
    .test(
      'requiredPhase',
      'Select at least one of: Phase, Operations and Maintenance, or Other',
      (value: any) => {
        if (
          value.development.isPresent ||
          value.operationsMaintenance.isPresent ||
          value.other.isPresent
        ) {
          return true;
        }
        return false;
      }
    )
    .shape({
      development: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required('Enter the development cost for Year 3')
        })
      }),
      operationsMaintenance: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required(
            'Enter the operations and maintenance cost for Year 3'
          )
        })
      }),
      other: Yup.object().shape({
        cost: Yup.string().when('isPresent', {
          is: true,
          then: Yup.string().required('Enter the other cost for Year 3')
        })
      })
    }),
  // Year 4 is not required
  year4: Yup.object().shape({
    development: Yup.object().shape({
      cost: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required('Enter the development cost for Year 4')
      })
    }),
    operationsMaintenance: Yup.object().shape({
      cost: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required(
          'Enter the operations and maintenance cost for Year 4'
        )
      })
    }),
    other: Yup.object().shape({
      cost: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required('Enter the other cost for Year 4')
      })
    })
  }),
  // Year 5 is not required
  year5: Yup.object().shape({
    development: Yup.object().shape({
      cost: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required('Enter the development cost for Year 5')
      })
    }),
    operationsMaintenance: Yup.object().shape({
      cost: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required(
          'Enter the operations and maintenance cost for Year 5'
        )
      })
    }),
    other: Yup.object().shape({
      cost: Yup.string().when('isPresent', {
        is: true,
        then: Yup.string().required('Enter the other cost for Year 5')
      })
    })
  })
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
          'Enter the requester’s phone number like 123456789 or 123-456-789'
        )
        .required(
          'Enter the Requester’s phone number like 123456789 or 123-456-789'
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
  asIsSolution: Yup.object().shape({
    asIsSolution: Yup.object().shape({
      title: Yup.string()
        .trim()
        .required('Enter a title for the "As is" solution'),
      summary: Yup.string()
        .trim()
        .required('Tell us about the "As is" solution'),
      pros: Yup.string()
        .trim()
        .required('Tell us about the pros of "As is" solution'),
      cons: Yup.string()
        .trim()
        .required('Tell us about the cons of "As is" solution'),
      estimatedLifecycleCost: estimatedLifecycleCostSchema,
      costSavings: Yup.string()
        .trim()
        .required(
          'Tell us about the cost savings or avoidance associated with this solution'
        )
    })
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
        isBeingReviewed: Yup.string().when('isApproved', {
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
      estimatedLifecycleCost: estimatedLifecycleCostSchema,
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
        isBeingReviewed: Yup.string().when('isApproved', {
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
      hasUserInterface: Yup.string().required(
        'Tell us whether the Alternative A solution will have user interface'
      ),
      pros: Yup.string()
        .trim()
        .required('Tell us about the pros of Alternative A solution'),
      cons: Yup.string()
        .trim()
        .required('Tell us about the cons of Alternative A solution'),
      estimatedLifecycleCost: estimatedLifecycleCostSchema,
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
        isBeingReviewed: Yup.string().when('isApproved', {
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
      estimatedLifecycleCost: estimatedLifecycleCostSchema,
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
        'Enter the requester’s phone number like 123456789 or 123-456-789'
      )
    })
  }),
  requestDescription: Yup.object().shape({}),
  asIsSolution: Yup.object().shape({}),
  preferredSolution: Yup.object().shape({}),
  alternativeA: Yup.object().shape({}),
  alternativeB: Yup.object().shape({})
};
