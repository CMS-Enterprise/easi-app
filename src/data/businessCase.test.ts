import { BusinessCaseModel } from 'types/businessCase';
import { ApiLifecycleCostLine } from 'types/estimatedLifecycle';

import {
  businessCaseInitialData,
  prepareBusinessCaseForApi,
  prepareBusinessCaseForApp
} from './businessCase';

const prefferedCostLines: ApiLifecycleCostLine[] = [
  {
    solution: 'Preferred',
    phase: 'Development',
    year: '1',
    cost: 500
  },
  {
    solution: 'Preferred',
    phase: 'Development',
    year: '2',
    cost: 500
  },
  {
    solution: 'Preferred',
    phase: 'Development',
    year: '3',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Development',
    year: '4',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Development',
    year: '5',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Operations and Maintenance',
    year: '1',
    cost: 1000
  },
  {
    solution: 'Preferred',
    phase: 'Operations and Maintenance',
    year: '2',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Operations and Maintenance',
    year: '3',
    cost: 1000
  },
  {
    solution: 'Preferred',
    phase: 'Operations and Maintenance',
    year: '4',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Operations and Maintenance',
    year: '5',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Infrastructure',
    year: '1',
    cost: 1500
  },
  {
    solution: 'Preferred',
    phase: 'Infrastructure',
    year: '2',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Infrastructure',
    year: '3',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Infrastructure',
    year: '4',
    cost: 0
  },
  {
    solution: 'Preferred',
    phase: 'Infrastructure',
    year: '5',
    cost: 0
  }
];

const solutionACostLines: ApiLifecycleCostLine[] = [
  {
    solution: 'A',
    phase: 'Help desk/call center',
    year: '1',
    cost: 10000
  },
  {
    solution: 'A',
    phase: 'Help desk/call center',
    year: '2',
    cost: 0
  },
  {
    solution: 'A',
    phase: 'Help desk/call center',
    year: '3',
    cost: 1000
  },
  {
    solution: 'A',
    phase: 'Help desk/call center',
    year: '4',
    cost: 300
  },
  {
    solution: 'A',
    phase: 'Help desk/call center',
    year: '5',
    cost: 0
  },
  {
    solution: 'A',
    phase: 'Software licenses',
    year: '1',
    cost: 300
  },
  {
    solution: 'A',
    phase: 'Software licenses',
    year: '2',
    cost: 600
  },
  {
    solution: 'A',
    phase: 'Software licenses',
    year: '3',
    cost: 40
  },
  {
    solution: 'A',
    phase: 'Software licenses',
    year: '4',
    cost: 0
  },
  {
    solution: 'A',
    phase: 'Software licenses',
    year: '5',
    cost: 0
  },
  {
    solution: 'A',
    phase: 'Infrastructure',
    year: '1',
    cost: 1500
  },
  {
    solution: 'A',
    phase: 'Infrastructure',
    year: '2',
    cost: 400
  },
  {
    solution: 'A',
    phase: 'Infrastructure',
    year: '3',
    cost: 0
  },
  {
    solution: 'A',
    phase: 'Infrastructure',
    year: '4',
    cost: 0
  },
  {
    solution: 'A',
    phase: 'Infrastructure',
    year: '5',
    cost: 0
  }
];
const solutionBCostLines: ApiLifecycleCostLine[] = [
  {
    solution: 'B',
    phase: 'Operations and Maintenance',
    year: '1',
    cost: 100
  },
  {
    solution: 'B',
    phase: 'Operations and Maintenance',
    year: '2',
    cost: 0
  },
  {
    solution: 'B',
    phase: 'Operations and Maintenance',
    year: '3',
    cost: 1000
  },
  {
    solution: 'B',
    phase: 'Operations and Maintenance',
    year: '4',
    cost: 300
  },
  {
    solution: 'B',
    phase: 'Operations and Maintenance',
    year: '5',
    cost: 0
  },
  {
    solution: 'B',
    phase: 'Planning, support, and professional services',
    year: '1',
    cost: 3000
  },
  {
    solution: 'B',
    phase: 'Planning, support, and professional services',
    year: '2',
    cost: 600
  },
  {
    solution: 'B',
    phase: 'Planning, support, and professional services',
    year: '3',
    cost: 4000
  },
  {
    solution: 'B',
    phase: 'Planning, support, and professional services',
    year: '4',
    cost: 0
  },
  {
    solution: 'B',
    phase: 'Planning, support, and professional services',
    year: '5',
    cost: 0
  },
  {
    solution: 'B',
    phase: 'OIT services, tools, and pilots',
    year: '1',
    cost: 1500
  },
  {
    solution: 'B',
    phase: 'OIT services, tools, and pilots',
    year: '2',
    cost: 40000
  },
  {
    solution: 'B',
    phase: 'OIT services, tools, and pilots',
    year: '3',
    cost: 0
  },
  {
    solution: 'B',
    phase: 'OIT services, tools, and pilots',
    year: '4',
    cost: 3000
  },
  {
    solution: 'B',
    phase: 'OIT services, tools, and pilots',
    year: '5',
    cost: 0
  }
];
const lifecycleCostLines: ApiLifecycleCostLine[] = [
  ...prefferedCostLines,
  ...solutionACostLines,
  ...solutionBCostLines
];

const mockBusinessCase: BusinessCaseModel = {
  ...businessCaseInitialData,
  preferredSolution: {
    title: 'Preferred title',
    summary: 'Preferred summary',
    acquisitionApproach: 'Preferred acquisition approach',
    security: {
      isApproved: null,
      isBeingReviewed: ''
    },
    hosting: {
      type: '',
      location: '',
      cloudServiceType: ''
    },
    hasUserInterface: '',
    pros: 'Preferred pros',
    cons: 'Preferred cons',
    costSavings: 'Preferred cost savings',
    estimatedLifecycleCost: {
      development: {
        label: 'Development',
        type: 'primary',
        isPresent: true,
        years: {
          year1: '500',
          year2: '500',
          year3: '0',
          year4: '0',
          year5: '0'
        }
      },
      operationsMaintenance: {
        label: 'Operations and Maintenance',
        type: 'primary',
        isPresent: true,
        years: {
          year1: '1000',
          year2: '0',
          year3: '1000',
          year4: '0',
          year5: '0'
        }
      },
      helpDesk: {
        label: 'Help desk/call center',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      software: {
        label: 'Software licenses',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      planning: {
        label: 'Planning, support, and professional services',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      infrastructure: {
        label: 'Infrastructure',
        type: 'related',
        isPresent: true,
        years: {
          year1: '1500',
          year2: '0',
          year3: '0',
          year4: '0',
          year5: '0'
        }
      },
      oit: {
        label: 'OIT services, tools, and pilots',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      other: {
        label: 'Other services, tools, and pilots',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      }
    }
  },
  alternativeA: {
    title: 'Preferred title',
    summary: 'Preferred summary',
    acquisitionApproach: 'Preferred acquisition approach',
    security: {
      isApproved: null,
      isBeingReviewed: ''
    },
    hosting: {
      type: '',
      location: '',
      cloudServiceType: ''
    },
    hasUserInterface: '',
    pros: 'Preferred pros',
    cons: 'Preferred cons',
    costSavings: 'Preferred cost savings',
    estimatedLifecycleCost: {
      development: {
        label: 'Development',
        type: 'primary',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      operationsMaintenance: {
        label: 'Operations and Maintenance',
        type: 'primary',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      helpDesk: {
        label: 'Help desk/call center',
        type: 'related',
        isPresent: true,
        years: {
          year1: '10000',
          year2: '0',
          year3: '1000',
          year4: '300',
          year5: '0'
        }
      },
      software: {
        label: 'Software licenses',
        type: 'related',
        isPresent: true,
        years: {
          year1: '300',
          year2: '600',
          year3: '40',
          year4: '0',
          year5: '0'
        }
      },
      planning: {
        label: 'Planning, support, and professional services',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      infrastructure: {
        label: 'Infrastructure',
        type: 'related',
        isPresent: true,
        years: {
          year1: '1500',
          year2: '400',
          year3: '0',
          year4: '0',
          year5: '0'
        }
      },
      oit: {
        label: 'OIT services, tools, and pilots',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      other: {
        label: 'Other services, tools, and pilots',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      }
    }
  },
  alternativeB: {
    title: 'Preferred title',
    summary: 'Preferred summary',
    acquisitionApproach: 'Preferred acquisition approach',
    security: {
      isApproved: null,
      isBeingReviewed: ''
    },
    hosting: {
      type: '',
      location: '',
      cloudServiceType: ''
    },
    hasUserInterface: '',
    pros: 'Preferred pros',
    cons: 'Preferred cons',
    costSavings: 'Preferred cost savings',
    estimatedLifecycleCost: {
      development: {
        label: 'Development',
        type: 'primary',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      operationsMaintenance: {
        label: 'Operations and Maintenance',
        type: 'primary',
        isPresent: true,
        years: {
          year1: '100',
          year2: '0',
          year3: '1000',
          year4: '300',
          year5: '0'
        }
      },
      helpDesk: {
        label: 'Help desk/call center',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      software: {
        label: 'Software licenses',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      planning: {
        label: 'Planning, support, and professional services',
        type: 'related',
        isPresent: true,
        years: {
          year1: '3000',
          year2: '600',
          year3: '4000',
          year4: '0',
          year5: '0'
        }
      },
      infrastructure: {
        label: 'Infrastructure',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      oit: {
        label: 'OIT services, tools, and pilots',
        type: 'related',
        isPresent: true,
        years: {
          year1: '1500',
          year2: '40000',
          year3: '0',
          year4: '3000',
          year5: '0'
        }
      },
      other: {
        label: 'Other services, tools, and pilots',
        type: 'related',
        isPresent: false,
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      }
    }
  }
};

describe('The business case data', () => {
  describe('prepareBusinessCaseForApp', () => {
    const testDataFromApi = {
      id: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
      euaUserId: 'ABCD',
      systemIntakeId: 'b6dce250-c13e-4704-b09c-cbcee8541479',
      status: 'OPEN',
      projectName: 'Test System',
      requester: 'User ABCD',
      requesterPhoneNumber: '1234567890',
      businessOwner: 'User HXEP',
      businessNeed: 'My business need',
      cmsBenefit: 'asdf',
      currentSolutionSummary: 'asdf',
      priorityAlignment: 'asdf',
      successIndicators: 'asdf',
      preferredTitle: 'Preferred title',
      preferredSummary: 'Preferred summary',
      preferredAcquisitionApproach: 'Preferred acquisition approach',
      preferredSecurityIsApproved: null,
      preferredSecurityIsBeingReviewed: '',
      preferredHostingType: '',
      preferredHostingLocation: '',
      preferredHostingCloudServiceType: '',
      preferredHasUI: '',
      preferredPros: 'Preferred pros',
      preferredCons: 'Preferred cons',
      preferredCostSavings: 'Preferred cost savings',
      alternativeATitle: '',
      alternativeASummary: '',
      alternativeAAcquisitionApproach: '',
      alternativeASecurityIsApproved: null,
      alternativeASecurityIsBeingReviewed: '',
      alternativeAHostingType: '',
      alternativeAHostingLocation: '',
      alternativeAHostingCloudServiceType: '',
      alternativeAHasUI: '',
      alternativeAPros: '',
      alternativeACons: '',
      alternativeACostSavings: '',
      alternativeBTitle: null,
      alternativeBSummary: null,
      alternativeBAcquisitionApproach: null,
      alternativeBSecurityIsApproved: null,
      alternativeBSecurityIsBeingReviewed: null,
      alternativeBHostingType: null,
      alternativeBHostingLocation: null,
      alternativeBHostingCloudServiceType: null,
      alternativeBHasUI: null,
      alternativeBPros: null,
      alternativeBCons: null,
      alternativeBCostSavings: null,
      lifecycleCostLines,
      createdAt: '2021-03-16T20:05:10.95265Z',
      updatedAt: '2021-03-16T20:11:36.867585Z',
      submittedAt: null,
      ArchivedAt: null,
      initialSubmittedAt: null,
      lastSubmittedAt: null
    };

    it('transforms preferred solution for app', () => {
      expect(
        prepareBusinessCaseForApp(testDataFromApi).preferredSolution
      ).toEqual(mockBusinessCase.preferredSolution);
    });
  });

  describe('prepareBusinessCaseForApi', () => {
    it('Formats lifecycle costs for API', () => {
      const formattedLifecycleCosts: ApiLifecycleCostLine[] =
        prepareBusinessCaseForApi(mockBusinessCase).lifecycleCostLines;

      expect(formattedLifecycleCosts).toEqual(lifecycleCostLines);
    });
  });
});
