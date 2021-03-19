import {
  businessCaseInitialData,
  prepareBusinessCaseForApi,
  prepareBusinessCaseForApp
} from './businessCase';

describe('The business case data', () => {
  describe('prepareBusinessCaseForApp', () => {
    const testDataFromApi = {
      id: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
      euaUserId: 'ABCD',
      systemIntakeId: 'b6dce250-c13e-4704-b09c-cbcee8541479',
      systemIntakeStatus: 'BIZ_CASE_DRAFT',
      status: 'OPEN',
      projectName: 'Test System',
      requester: 'User ABCD',
      requesterPhoneNumber: '1234567890',
      businessOwner: 'User HXEP',
      businessNeed: 'My business need',
      cmsBenefit: 'asdf',
      priorityAlignment: 'asdf',
      successIndicators: 'asdf',
      asIsTitle: 'As is title',
      asIsSummary: 'As is summary',
      asIsPros: 'As is pros',
      asIsCons: 'As is cons',
      asIsCostSavings: 'As is cost savings',
      preferredTitle: '',
      preferredSummary: '',
      preferredAcquisitionApproach: '',
      preferredSecurityIsApproved: null,
      preferredSecurityIsBeingReviewed: '',
      preferredHostingType: '',
      preferredHostingLocation: '',
      preferredHostingCloudServiceType: '',
      preferredHasUI: '',
      preferredPros: '',
      preferredCons: '',
      preferredCostSavings: '',
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
      lifecycleCostLines: [
        {
          id: '5e232a8d-8f76-4d6c-b902-158f19fc85cd',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Development',
          year: '1',
          cost: 1
        },
        {
          id: '18dab0c5-c48a-43a1-8ade-5348d684c51c',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          year: '1',
          cost: 2
        },
        {
          id: '64800155-b01f-45f4-bf56-0c407aed4bd5',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Other',
          year: '1',
          cost: 3
        },
        {
          id: '65f6f0f8-ce09-41e0-94ed-331aa6e0449a',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Development',
          year: '2',
          cost: 4
        },
        {
          id: 'a2c93ac5-1897-4d40-a259-98c3b953e9d5',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          year: '2',
          cost: null
        },
        {
          id: '7e74157c-4e15-4b63-aa03-7d3d3614f7fa',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Other',
          year: '2',
          cost: 5
        },
        {
          id: '99d1dffc-c09f-4d78-a47a-bf9df6c470af',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Development',
          year: '3',
          cost: null
        },
        {
          id: '97aa59a3-804c-454a-85e9-266a7ee1a204',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          year: '3',
          cost: 6
        },
        {
          id: 'd9bfd983-60f0-4cf5-894a-8df6de644e18',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Other',
          year: '3',
          cost: 7
        },
        {
          id: 'eba6c59f-4274-4024-a41e-7692cc2bf617',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Development',
          year: '4',
          cost: 8
        },
        {
          id: '715fd337-d4bb-4460-bf0f-7d55fd5958c1',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          year: '4',
          cost: 9
        },
        {
          id: '533528be-f2b5-4b31-acdd-75fe01ef934b',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Other',
          year: '4',
          cost: null
        },
        {
          id: '8f4045ee-bb74-446c-9574-43f42c7adebe',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Development',
          year: '5',
          cost: 10
        },
        {
          id: 'fb023b7b-bc38-473e-9804-d8741981253b',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          year: '5',
          cost: 11
        },
        {
          id: '69ab8880-59db-45dc-a959-6551f6714dce',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'As Is',
          phase: 'Other',
          year: '5',
          cost: 12
        },
        {
          id: '11ac8fc1-18c6-4085-acd3-ca3f96caba8e',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Development',
          year: '1',
          cost: null
        },
        {
          id: '390ba808-5ee3-4547-b371-6fcff7d4bb42',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '1',
          cost: null
        },
        {
          id: '23d4de1f-13a4-4ddf-905e-2cdf601d4bb4',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Other',
          year: '1',
          cost: null
        },
        {
          id: 'baf4314e-f9c3-4c9d-a838-abf53bbba63a',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Development',
          year: '2',
          cost: null
        },
        {
          id: '136b50c2-221d-4f65-a8f0-b64bcda03610',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '2',
          cost: null
        },
        {
          id: '0c7bda06-a714-4fa2-98d2-dd48c80c5148',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Other',
          year: '2',
          cost: null
        },
        {
          id: '876bf41d-148b-4ae9-8991-2c13ff07cd41',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Development',
          year: '3',
          cost: null
        },
        {
          id: '7500f2f5-844a-4286-ba16-0107df203280',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '3',
          cost: null
        },
        {
          id: '6b0fe308-a83b-4819-aa1a-3ea53ab798d1',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Other',
          year: '3',
          cost: null
        },
        {
          id: '2ba3664c-0f2c-47fd-84fe-06b4f901c1a7',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Development',
          year: '4',
          cost: null
        },
        {
          id: '721086b9-5fe0-4601-8e62-763404460eb7',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '4',
          cost: null
        },
        {
          id: 'f0514373-7f38-4a64-ba03-e659b21d52fd',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Other',
          year: '4',
          cost: null
        },
        {
          id: 'cfde10c9-6b46-443f-aae7-39f82c809f1d',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Development',
          year: '5',
          cost: null
        },
        {
          id: '4f7baf84-3826-4853-8f1f-1bf990bc656c',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '5',
          cost: null
        },
        {
          id: '12905fc0-2085-49d9-9e64-0f9dafa21a93',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'Preferred',
          phase: 'Other',
          year: '5',
          cost: null
        },
        {
          id: '67d9f6ce-c22c-4887-b667-bbbe3951e615',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Development',
          year: '1',
          cost: null
        },
        {
          id: 'ea9fef9e-80f5-48f6-9de7-663979da455e',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '1',
          cost: null
        },
        {
          id: '9280b1d1-c10b-4eb3-99c4-4bb5574c545f',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Other',
          year: '1',
          cost: null
        },
        {
          id: 'e602f75c-d4dc-4a07-a5fd-3bbfad1476e2',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Development',
          year: '2',
          cost: null
        },
        {
          id: '77c2f7a7-33cf-4910-b055-2e6a3ab71590',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '2',
          cost: null
        },
        {
          id: '6fcc8ce6-64bc-4ca3-a12d-cc714912fcaf',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Other',
          year: '2',
          cost: null
        },
        {
          id: '42ccb9f4-ea29-4eb3-aa97-bf831bc3b113',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Development',
          year: '3',
          cost: null
        },
        {
          id: '7a68e6f9-a188-4986-9ebc-648046d2b73a',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '3',
          cost: null
        },
        {
          id: '2bdd8054-b5cd-465a-9853-86e6c7f1a527',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Other',
          year: '3',
          cost: null
        },
        {
          id: 'c4e4b40c-51da-4bcd-9a1c-05fe8058c43c',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Development',
          year: '4',
          cost: null
        },
        {
          id: 'ebdd1c72-0a81-4b8b-b7d6-efee9c10786d',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '4',
          cost: null
        },
        {
          id: 'bfb66616-9d7f-42b7-83ac-52c215c9a77b',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Other',
          year: '4',
          cost: null
        },
        {
          id: '7ff6ac81-758e-454c-a9d7-c5998613116d',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Development',
          year: '5',
          cost: null
        },
        {
          id: '15f4dd91-ed5c-4555-84c7-feef9a5aa90f',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '5',
          cost: null
        },
        {
          id: 'a22a7e7b-0a3b-4a0d-87f7-0d21bf785e80',
          business_case: '879dec4a-6bab-4cfa-bd55-e6e4b91ea8f0',
          solution: 'A',
          phase: 'Other',
          year: '5',
          cost: null
        }
      ],
      createdAt: '2021-03-16T20:05:10.95265Z',
      updatedAt: '2021-03-16T20:11:36.867585Z',
      submittedAt: null,
      ArchivedAt: null,
      initialSubmittedAt: null,
      lastSubmittedAt: null
    };

    it('transforms as is solution for app', () => {
      const asisSolution = {
        title: 'As is title',
        summary: 'As is summary',
        pros: 'As is pros',
        cons: 'As is cons',
        costSavings: 'As is cost savings',
        estimatedLifecycleCost: {
          year1: {
            development: {
              isPresent: true,
              cost: '1'
            },
            operationsMaintenance: {
              isPresent: true,
              cost: '2'
            },
            other: {
              isPresent: true,
              cost: '3'
            }
          },
          year2: {
            development: {
              isPresent: true,
              cost: '4'
            },
            operationsMaintenance: {
              isPresent: false,
              cost: ''
            },
            other: {
              isPresent: true,
              cost: '5'
            }
          },
          year3: {
            development: {
              isPresent: false,
              cost: ''
            },
            operationsMaintenance: {
              isPresent: true,
              cost: '6'
            },
            other: {
              isPresent: true,
              cost: '7'
            }
          },
          year4: {
            development: {
              isPresent: true,
              cost: '8'
            },
            operationsMaintenance: {
              isPresent: true,
              cost: '9'
            },
            other: {
              isPresent: false,
              cost: ''
            }
          },
          year5: {
            development: {
              isPresent: true,
              cost: '10'
            },
            operationsMaintenance: {
              isPresent: true,
              cost: '11'
            },
            other: {
              isPresent: true,
              cost: '12'
            }
          }
        }
      };
      expect(prepareBusinessCaseForApp(testDataFromApi).asIsSolution).toEqual(
        asisSolution
      );
    });
  });

  describe('prepareBusinessCaseForApi', () => {
    it('does not save estimated lifecycle cost if checkbox is not checked', () => {
      // ONLY checking As is solution lifecycle lines in this test
      // other solutions should behave the same
      const testBusinessCase = {
        ...businessCaseInitialData,
        asIsSolution: {
          title: '',
          summary: '',
          pros: '',
          cons: '',
          estimatedLifecycleCost: {
            year1: {
              development: {
                isPresent: false,
                cost: '500'
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '1000'
              },
              other: {
                isPresent: false,
                cost: '1500'
              }
            },
            year2: {
              development: {
                isPresent: true,
                cost: '500'
              },
              operationsMaintenance: {
                isPresent: false,
                cost: '1000'
              },
              other: {
                isPresent: false,
                cost: '1500'
              }
            },
            year3: {
              development: {
                isPresent: false,
                cost: '500'
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '1000'
              },
              other: {
                isPresent: true,
                cost: '1500'
              }
            },
            year4: {
              development: {
                isPresent: false,
                cost: '500'
              },
              operationsMaintenance: {
                isPresent: false,
                cost: '1000'
              },
              other: {
                isPresent: false,
                cost: '1500'
              }
            },
            year5: {
              development: {
                isPresent: true,
                cost: '500'
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '1000'
              },
              other: {
                isPresent: true,
                cost: '1500'
              }
            }
          },
          costSavings: ''
        }
      };

      const asIsLifecycleLines = [
        { solution: 'As Is', phase: 'Development', cost: '', year: '1' },
        {
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          cost: 1000,
          year: '1'
        },
        { solution: 'As Is', phase: 'Other', cost: '', year: '1' },
        { solution: 'As Is', phase: 'Development', cost: 500, year: '2' },
        {
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          cost: '',
          year: '2'
        },
        { solution: 'As Is', phase: 'Other', cost: '', year: '2' },
        { solution: 'As Is', phase: 'Development', cost: '', year: '3' },
        {
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          cost: 1000,
          year: '3'
        },
        { solution: 'As Is', phase: 'Other', cost: 1500, year: '3' },
        { solution: 'As Is', phase: 'Development', cost: '', year: '4' },
        {
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          cost: '',
          year: '4'
        },
        { solution: 'As Is', phase: 'Other', cost: '', year: '4' },
        { solution: 'As Is', phase: 'Development', cost: 500, year: '5' },
        {
          solution: 'As Is',
          phase: 'Operations and Maintenance',
          cost: 1000,
          year: '5'
        },
        { solution: 'As Is', phase: 'Other', cost: 1500, year: '5' }
      ];

      expect(
        prepareBusinessCaseForApi(testBusinessCase).lifecycleCostLines
      ).toEqual(expect.arrayContaining(asIsLifecycleLines));
    });
  });
});
