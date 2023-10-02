import {
  convertIntakeToCSV,
  initialSystemIntakeForm,
  isIntakeStarted
} from './systemIntake';

describe('The system intake data modifiers', () => {
  describe('convertIntakesToCSV', () => {
    it('converts empty intake', () => {
      expect(convertIntakeToCSV(initialSystemIntakeForm)).toMatchObject({
        euaUserId: '',
        requester: {
          name: '',
          component: ''
        },
        businessOwner: {
          name: '',
          component: ''
        },
        productManager: {
          name: '',
          component: ''
        },
        isso: {
          name: ''
        },
        requestName: '',
        existingFunding: null,
        fundingSources: [],
        businessNeed: '',
        businessSolution: '',
        currentStage: '',
        needsEaSupport: null,
        annualSpending: {
          currentAnnualSpending: '',
          plannedYearOneSpending: ''
        },
        contract: {
          hasContract: '',
          contractor: '',
          number: ''
        },
        contractStartDate: '',
        contractEndDate: '',
        status: 'INTAKE_DRAFT',
        updatedAt: null,
        submittedAt: null,
        createdAt: null,
        decidedAt: null,
        archivedAt: null,
        adminLead: '',
        lcidScope: '',
        hasUiChanges: null
      });
    });

    it('converts fully executed intake', () => {
      const mockIntake = {
        ...initialSystemIntakeForm,
        id: 'addaa218-34d3-4dd8-a12f-38f6ff33b22d',
        euaUserId: 'ABCD',
        submittedAt: '2020-06-26T20:22:04Z',
        requestName: 'Easy Access to System Information',
        requester: {
          name: 'Christopher Hui',
          component: 'Division of Pop Corners',
          email: ''
        },
        businessOwner: {
          name: 'Business Owner 1',
          component: 'Office of Information Technology'
        },
        productManager: {
          name: 'Product Manager 1',
          component: 'Office of Information Technology'
        },
        isso: {
          isPresent: true,
          name: 'John ISSO'
        },
        governanceTeams: {
          isPresent: true,
          teams: [
            {
              name: 'Technical Review Board',
              collaborator: 'Chris TRB',
              key: '1'
            },
            {
              name: "OIT's Security and Privacy Group",
              collaborator: 'Sam OIT Security',
              key: '2'
            },
            {
              name: 'Enterprise Architecture',
              collaborator: 'Todd EA',
              key: '3'
            }
          ]
        },
        existingFunding: true,
        fundingSources: [{ fundingNumber: '123456', source: 'CLIA' }],
        annualSpending: {
          currentAnnualSpending: 'Test Current Annual Spending',
          plannedYearOneSpending: 'Test Planned Year One Spending'
        },
        contract: {
          number: '',
          hasContract: 'IN_PROGRESS',
          contractor: 'TrussWorks, Inc.',
          vehicle: 'Fixed price contract',
          startDate: {
            month: '1',
            day: '4',
            year: '2015'
          },
          endDate: {
            month: '12',
            day: '9',
            year: '2021'
          }
        },
        businessNeed: 'Test business need',
        businessSolution: 'Test business solution',
        currentStage: 'Test current stage',
        needsEaSupport: true,
        status: 'Submitted',
        decidedAt: '2020-06-27T20:22:04Z',
        createdAt: '2020-06-22T20:22:04Z',
        updatedAt: '2020-06-23T20:22:04Z',
        archivedAt: '2020-06-28T20:22:04Z',
        adminLead: 'Test Admin Lead',
        lcidScope: '',
        requesterNameAndComponent: '',
        hasUiChanges: true
      };

      expect(convertIntakeToCSV(mockIntake)).toMatchObject({
        euaUserId: 'ABCD',
        requester: {
          name: 'Christopher Hui',
          component: 'Division of Pop Corners',
          email: ''
        },
        businessOwner: {
          name: 'Business Owner 1',
          component: 'Office of Information Technology'
        },
        productManager: {
          name: 'Product Manager 1',
          component: 'Office of Information Technology'
        },
        isso: {
          name: 'John ISSO'
        },
        trbCollaborator: 'Chris TRB',
        oitCollaborator: 'Sam OIT Security',
        eaCollaborator: 'Todd EA',
        existingFunding: true,
        fundingSources: [
          {
            source: 'CLIA',
            fundingNumber: '123456'
          }
        ],
        annualSpending: {
          currentAnnualSpending: 'Test Current Annual Spending',
          plannedYearOneSpending: 'Test Planned Year One Spending'
        },
        contract: {
          hasContract: 'IN_PROGRESS',
          contractor: 'TrussWorks, Inc.',
          vehicle: 'Fixed price contract'
        },
        contractStartDate: '1/4/2015',
        contractEndDate: '12/9/2021',
        businessNeed: 'Test business need',
        businessSolution: 'Test business solution',
        currentStage: 'Test current stage',
        needsEaSupport: true,
        status: 'Submitted',
        submittedAt: '2020-06-26T20:22:04Z',
        decidedAt: '2020-06-27T20:22:04Z',
        createdAt: '2020-06-22T20:22:04Z',
        updatedAt: '2020-06-23T20:22:04Z',
        archivedAt: '2020-06-28T20:22:04Z',
        adminLead: 'Test Admin Lead',
        lcidScope: '',
        hasUiChanges: true
      });
    });
  });

  describe('isIntakeStarted', () => {
    it('returns initial data as not started', () => {
      expect(isIntakeStarted(initialSystemIntakeForm)).toEqual(false);
    });

    it('returns data generated by backend as not started', () => {
      const data = {
        ...initialSystemIntakeForm,
        id: '12345',
        requester: {
          name: 'Bob',
          component: '',
          email: ''
        },
        status: 'INTAKE_DRAFT'
      };

      expect(isIntakeStarted(data)).toEqual(false);
    });

    it('returns any filled out fields as started', () => {
      const data = {
        ...initialSystemIntakeForm,
        businessOwner: {
          name: 'Bob',
          component: 'OIT'
        }
      };
      expect(isIntakeStarted(data)).toEqual(true);
    });
  });
});
