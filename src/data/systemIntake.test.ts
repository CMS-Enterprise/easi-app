import { DateTime } from 'luxon';

import { convertIntakeToCSV, initialSystemIntakeForm } from './systemIntake';

describe('The system intake data modifiers', () => {
  describe('convertIntakesToCSV', () => {
    it('converts empty intake', () => {
      expect(convertIntakeToCSV(initialSystemIntakeForm)).toMatchObject({
        euaUserID: '',
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
        status: 'DRAFT',
        updatedAt: null,
        submittedAt: null,
        createdAt: null,
        decidedAt: null,
        archivedAt: null
      });
    });
    it('converts fully executed intake', () => {
      const mockIntake = {
        ...initialSystemIntakeForm,
        id: 'addaa218-34d3-4dd8-a12f-38f6ff33b22d',
        euaUserID: 'ABCD',
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
            year: '2015'
          },
          endDate: {
            month: '12',
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
        })
      };

      expect(convertIntakeToCSV(mockIntake)).toMatchObject({
        euaUserID: 'ABCD',
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
        contractStartDate: '1/2015',
        contractEndDate: '12/2021',
        businessNeed: 'Test business need',
        businessSolution: 'Test business solution',
        currentStage: 'Test current stage',
        needsEaSupport: true,
        status: 'Submitted',
        submittedAt: '2020-06-26T00:00:00.000-07:00',
        decidedAt: '2020-06-27T00:00:00.000-07:00',
        createdAt: '2020-06-22T00:00:00.000-07:00',
        updatedAt: '2020-06-23T00:00:00.000-07:00',
        archivedAt: '2020-06-28T00:00:00.000-07:00'
      });
    });
  });
});
