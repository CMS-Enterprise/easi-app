import { DateTime } from 'luxon';

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
        fundingSource: {
          isFunded: null,
          source: '',
          fundingNumber: ''
        },
        businessNeed: '',
        businessSolution: '',
        currentStage: '',
        needsEaSupport: null,
        costs: {
          isExpectingIncrease: '',
          expectedIncreaseAmount: ''
        },
        contract: {
          hasContract: '',
          contractor: '',
          vehicle: ''
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
        lastAdminNote: null,
        lcidScope: ''
      });
    });

    it('converts fully executed intake', () => {
      const mockIntake = {
        ...initialSystemIntakeForm,
        id: 'addaa218-34d3-4dd8-a12f-38f6ff33b22d',
        euaUserId: 'ABCD',
        submittedAt: DateTime.fromObject({
          year: 2020,
          month: 6,
          day: 26,
          zone: 'America/Los_Angeles'
        }),
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
              collaborator: 'Chris TRB'
            },
            {
              name: "OIT's Security and Privacy Group",
              collaborator: 'Sam OIT Security'
            },
            {
              name: 'Enterprise Architecture',
              collaborator: 'Todd EA'
            }
          ]
        },
        fundingSource: {
          isFunded: true,
          source: 'CLIA',
          fundingNumber: '123456'
        },
        costs: {
          isExpectingIncrease: 'YES',
          expectedIncreaseAmount: 'One million'
        },
        contract: {
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
        decidedAt: DateTime.fromObject({
          year: 2020,
          month: 6,
          day: 27,
          zone: 'America/Los_Angeles'
        }),
        createdAt: DateTime.fromObject({
          year: 2020,
          month: 6,
          day: 22,
          zone: 'America/Los_Angeles'
        }),
        updatedAt: DateTime.fromObject({
          year: 2020,
          month: 6,
          day: 23,
          zone: 'America/Los_Angeles'
        }),
        archivedAt: DateTime.fromObject({
          year: 2020,
          month: 6,
          day: 28,
          zone: 'America/Los_Angeles'
        }),
        adminLead: 'Test Admin Lead',
        lastAdminNote: {
          content: 'last admin note',
          createdAt: DateTime.fromObject({
            year: 2020,
            month: 6,
            day: 22,
            zone: 'America/Los_Angeles'
          })
        },
        lcidScope: ''
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
        fundingSource: {
          source: 'CLIA',
          fundingNumber: '123456'
        },
        costs: {
          isExpectingIncrease: 'YES',
          expectedIncreaseAmount: 'One million'
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
        submittedAt: '2020-06-26T00:00:00.000-07:00',
        decidedAt: '2020-06-27T00:00:00.000-07:00',
        createdAt: '2020-06-22T00:00:00.000-07:00',
        updatedAt: '2020-06-23T00:00:00.000-07:00',
        archivedAt: '2020-06-28T00:00:00.000-07:00',
        adminLead: 'Test Admin Lead',
        lastAdminNote: 'last admin note (June 22 2020)',
        lcidScope: ''
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
        status: 'INTAKE_DRAFT',
        requestType: 'NEW'
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
