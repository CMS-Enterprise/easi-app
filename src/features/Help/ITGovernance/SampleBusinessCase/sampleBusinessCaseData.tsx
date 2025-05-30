import { BusinessCaseModel } from 'types/businessCase';

const sampleBusinessCaseData: BusinessCaseModel = {
  id: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
  euaUserId: 'ABCD',
  status: 'OPEN',
  systemIntakeId: 'b6dce250-c13e-4704-b09c-cbcee8541479',
  requestName: 'Workflow Improvement Project (WIP)',
  projectAcronym: 'WIP',
  requester: {
    name: 'Jane Doe',
    phoneNumber: '410-786-XXXX'
  },
  businessOwner: {
    name: 'John Smith'
  },
  businessNeed:
    'Currently ICPG has a manual process to track the number of widgets used in the IT capital planning process. This requires a team of five people to count, identify, and invoice for the widgets, taking approximately 30 hours per person, per week and taking away from other duties, and in particular hours that will be needed as a result of the new FORM Act, which will double our workload starting in two years. We believe that an automated IT solution will reduce the current workload, freeing up staff resources and streamlining our processes to accomodate the FORM Act.',
  collaborationNeeded:
    'We will need to work with the Office of Acquisition and Grants Management (OAGM) to procure the solution, and with the Office of Information Technology (OIT) to implement the solution. We will also need to work with the Office of Financial Management (OFM) to ensure that the solution meets all invoicing requirements.',
  currentSolutionSummary:
    'Currently ICPG has a manual process to track the number of widgets used in the IT capital planning process. This requires a team of five people to count, identify, and invoice for the widgets, taking approximately 30 hours per person, per week. When the FORM Act doubles our workload, 150 new FTE hours per week will be needed, necessitating four new FTEs.',
  cmsBenefit:
    'The IT capital planning process is the agency’s means of ensuring that our IT investments are a wise use of CMS resources, meeting business needs at acceptable costs and without duplication. The capital planning process relies on widgets as an input to the process in order to inform decision makers. Due to our manual processes, there is a widget tracking backlog, meaning CMS decision makers do not have the information that they need to make capital planning decisions. Meeting this business need will allow CMS to make better decisions and manage our IT portfolio more cost effectively, saving the agency money.',
  priorityAlignment:
    'This effort aligns with the Agency modernization initiative and also supports FITARA and Form Act implementation.',
  successIndicators:
    'With our preferred solution, we expect that the number of FTE hours required to track widgets will decrease our current workload by 75%. Even with the FORM Act doubling our workload, this would still equate to a total FTE hour reduction of 50%, if the process is fully automated.',
  responseToGRTFeedback: '',
  preferredSolution: {
    title: 'ServiceNow',
    summary:
      'ServiceNow’s workflow process capabilities can be used to route the widget tracking process and automate the identification and counting of the widgets. Thier platform is being proposed, utilizing an existing licensing agreement.',
    acquisitionApproach:
      'We are planning to use the current instance of ServiceNow used elsewhere in OIT.',
    targetContractAwardDate: '2025-03-15',
    targetCompletionDate: '2025-09-15',
    pros: 'This solution can be accomplished prior to the end of the fiscal year, is user-friendly, and already meets agency security requirements.',
    cons: 'The solution does not have invoicing capabilities and approximately fifteen hours of staff time per person will still be needed each week to accomplish all tasks, including the FORM Act.',
    costSavings:
      'This solution will reduce widget tracking time needed by about 75%. If implemented, the staff hours freed up will mean that ICPG will not need to request additional staff to implement the FORM Act in two years, translating to $684,000 in cost avoidance in that first year.',
    workforceTrainingReqs: 'This solution will require training for all staff.',
    estimatedLifecycleCost: {
      development: {
        label: 'Development',
        isPresent: true,
        type: 'primary',
        years: {
          year1: '1700000',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      operationsMaintenance: {
        label: 'Operations and Maintenance',
        isPresent: true,
        type: 'primary',
        years: {
          year1: '',
          year2: '160000',
          year3: '164800',
          year4: '169744',
          year5: '174836'
        }
      },
      helpDesk: {
        label: 'Help desk/call center',
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      }
    },
    security: {
      isApproved: true,
      isBeingReviewed: '',
      zeroTrustAlignment:
        'It will be aligned with the Zero Trust Architecture (ZTA) principles and practices.'
    },
    hosting: {
      type: 'cloud',
      location: 'CMS AWS Cloud Instance - SaaS - ServiceNow; IaaS -',
      cloudStrategy: 'CMS Cloud First Strategy',
      cloudServiceType: ''
    },
    hasUserInterface: 'YES'
  },
  alternativeA: {
    title: 'Atlassian',
    summary:
      'Atlassian’s workflow process capabilities can be used to route the widget tracking process and automate the identification, counting, and invoicing of widgets. Thier platform is being proposed, to be housed in AWS.',
    acquisitionApproach:
      'This will be a new procurement, using OAGM’s preferred contract vehicle.',
    targetContractAwardDate: '2025-03-15',
    targetCompletionDate: '2025-09-15',
    pros: 'This solution can perform the entirety of the widget processing workflow, including invoicing, thereby reducing staff time to approximately twelve hours per week per person to accomplish all tasks, including the FORM Act.',
    cons: 'This solution will have higher operational costs than the other alternatives. WE are unsure of the onboarding process for Microsoft Azure Government and what the ATO process will look like',
    costSavings:
      'This solution will reduce tracking time needed by about 80%. If implemented, the staff hours freed up will mean that ICPG will not need to request additional staff to implement the FORM Act in two years, translating to $684,000 in cost avoidance in that first year.',
    workforceTrainingReqs: 'This solution will not require training for staff.',
    estimatedLifecycleCost: {
      development: {
        label: 'Development',
        isPresent: true,
        type: 'primary',
        years: {
          year1: '750000',
          year2: '500000',
          year3: '',
          year4: '',
          year5: ''
        }
      },
      operationsMaintenance: {
        label: 'Operations and Maintenance',
        isPresent: true,
        type: 'primary',
        years: {
          year1: '',
          year2: '',
          year3: '250000',
          year4: '257500',
          year5: '265225'
        }
      },
      helpDesk: {
        label: 'Help desk/call center',
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      }
    },
    security: {
      isApproved: false,
      isBeingReviewed: 'NO',
      zeroTrustAlignment:
        'It will be aligned with the Zero Trust Architecture (ZTA) principles and practices.'
    },
    hosting: {
      type: 'cloud',
      location: 'Microsoft Azure Government Cloud - SaaS - Atlassia',
      cloudStrategy: 'CMS Cloud Second Strategy',
      cloudServiceType: ''
    },
    hasUserInterface: 'YES'
  },
  alternativeB: {
    title: 'Sharepoint',
    summary:
      'Sharepoint’s workflow process capabilities can be used to route the widget tracking process and automate the identification and counting of the widgets. This platform already currently exists as a CMS enterprise service.',
    acquisitionApproach:
      'This solution exists in-house, with no procurement necessary.',
    targetContractAwardDate: '2025-03-15',
    targetCompletionDate: '2025-09-15',
    pros: 'This solution will not add any direct additional costs or infrastructure, security/privacy, and 508 compliance risks',
    cons: 'The solution does not have invoicing or visualization capabilities and one additional FTE will still need to be hired to implement the FORM Act. It is also not as customizable as the other two proposed solutions.',
    costSavings:
      'This solution will reduce tracking time needed by about 40%. If implemented, ICPG will need to only request one additional FTE, rather than four to implement the FORM Act in two years, translating to $513,000 in cost avoidance in that first year.',
    workforceTrainingReqs:
      'This solution will require training for some staff.',
    estimatedLifecycleCost: {
      development: {
        label: 'Development',
        isPresent: false,
        type: 'primary',
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
        isPresent: true,
        type: 'primary',
        years: {
          year1: '',
          year2: '',
          year3: '171000',
          year4: '176130',
          year5: '181414'
        }
      },
      helpDesk: {
        label: 'Help desk/call center',
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
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
        isPresent: false,
        type: 'related',
        years: {
          year1: '',
          year2: '',
          year3: '',
          year4: '',
          year5: ''
        }
      }
    },
    security: {
      isApproved: true,
      isBeingReviewed: '',
      zeroTrustAlignment:
        'It will be aligned with the Zero Trust Architecture (ZTA) principles and practices.'
    },
    hosting: {
      type: 'dataCenter',
      location: 'Baltimore Data Center - PaaS - Sharepoint',
      cloudStrategy: 'CMS Cloud Third Strategy',
      cloudServiceType: ''
    },
    hasUserInterface: 'YES'
  },
  createdAt: '2021-03-16T20:05:10.95265Z',
  updatedAt: '2021-03-17T20:05:10.95265Z'
};

export default sampleBusinessCaseData;
