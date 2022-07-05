import { BusinessCaseModel } from 'types/businessCase';

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
      lifecycleCostLines: [
        {
          id: '61c1b91e-fc85-4b38-a9a2-2d9a89f44e28',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Development',
          year: '1',
          cost: 1
        },
        {
          id: 'f21a345d-e302-40ad-8539-6d0e73020ebb',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Development',
          year: '2',
          cost: 4
        },
        {
          id: '242ef3a8-0724-4fdd-8315-3e6f17ca5b6a',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Development',
          year: '3',
          cost: null
        },
        {
          id: '29b2056f-f6d2-4b22-aa3c-93c4df18cc75',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Development',
          year: '4',
          cost: 8
        },
        {
          id: 'f5b91ebf-0548-45fe-92a2-6697d3261126',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Development',
          year: '5',
          cost: 10
        },
        {
          id: 'c0384613-0f44-4c8e-a68f-7517e2f03604',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '1',
          cost: 2
        },
        {
          id: '685d706a-686b-4af6-b1a1-9f54cd08c4aa',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '2',
          cost: null
        },
        {
          id: 'dc7d7736-16f7-484a-bb85-d3e5133ec921',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '3',
          cost: 6
        },
        {
          id: 'c3b7d0cf-5fc1-4b71-a06f-f6b7b2fd5dae',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '4',
          cost: 9
        },
        {
          id: 'd6d97a8d-c1cc-41ee-aaba-66088a38d348',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '5',
          cost: 11
        },
        {
          id: '7619ad2d-5c50-4979-a83c-3d13ae6ab107',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '1',
          cost: null
        },
        {
          id: 'a5237262-fdc6-49f4-9c27-cea78f74a01a',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '2',
          cost: null
        },
        {
          id: 'e2beb269-5fc7-4f3c-baac-95e09c4c12bc',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '3',
          cost: null
        },
        {
          id: '3c31cdf5-e613-403e-9c4a-8229f85c7239',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '4',
          cost: null
        },
        {
          id: '829b518d-1bd0-4b72-9d72-237590626965',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '5',
          cost: null
        },
        {
          id: 'bfe6c5c3-e34d-414f-9cbb-6091e6be8803',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '1',
          cost: null
        },
        {
          id: '4b9ba475-3bcd-471a-9aaf-6432ff9005ef',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '2',
          cost: null
        },
        {
          id: '813ebe9c-2fa8-4766-a5dd-0007d2e41fa4',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '3',
          cost: null
        },
        {
          id: '0f53c022-423c-45fd-9745-5cf61ff4926f',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '4',
          cost: null
        },
        {
          id: '705d1bf5-88fd-4e9d-b2b1-3abd2c9740fe',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '5',
          cost: null
        },
        {
          id: '960da6e0-85b1-47b3-9ac3-d5e6f362727d',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '1',
          cost: null
        },
        {
          id: '9f83e7e6-7270-4992-925d-0e16873d28b2',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '2',
          cost: null
        },
        {
          id: '0a9bb3c9-9058-4e6c-836a-b880139c778f',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '3',
          cost: null
        },
        {
          id: 'f88b5505-bd73-4cbf-8647-40d4b2869b8f',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '4',
          cost: null
        },
        {
          id: '64bee8f6-a701-4376-85f9-75ad3db315ac',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '5',
          cost: null
        },
        {
          id: '37ed4094-0d2e-4561-9823-01b9c290c283',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '1',
          cost: 3
        },
        {
          id: '32c7e764-914c-4dba-91c8-1d7c6fc8cc62',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '2',
          cost: 5
        },
        {
          id: '6669ee28-b682-4575-9dfc-863864910fa4',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '3',
          cost: 7
        },
        {
          id: '376f66fb-4d9f-486c-be40-99fc0608cab3',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '4',
          cost: null
        },
        {
          id: '392a2924-defe-469b-ad0a-932e9b0e23e1',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '5',
          cost: 12
        },
        {
          id: '34d77e37-2d90-4da2-a577-e6c293c04902',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '1',
          cost: null
        },
        {
          id: 'aa01dd87-682f-4449-b851-3c4f412a6393',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '2',
          cost: null
        },
        {
          id: '797c2a66-75fb-4201-bde9-daee299a124d',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '3',
          cost: null
        },
        {
          id: '206ad43b-4d9b-4c71-913c-de6998e50dc7',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '4',
          cost: null
        },
        {
          id: 'a0e475b9-e9b5-42c4-a40f-efbb2e1cafda',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '5',
          cost: null
        },
        {
          id: 'e73af2bb-7787-4f9b-bee0-2f986db742f0',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Other',
          year: '1',
          cost: null
        },
        {
          id: 'b84eaec9-9477-4160-bee0-d958ab26e88f',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Other',
          year: '2',
          cost: null
        },
        {
          id: 'fdb71f9a-e3f1-47c4-a904-c933e2285160',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Other',
          year: '3',
          cost: null
        },
        {
          id: 'dafbeb88-ee8f-453f-b185-139a5d6f0ee1',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Other',
          year: '4',
          cost: null
        },
        {
          id: '169d67b6-084f-4267-b5d2-8ad0c42d98ac',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'Preferred',
          phase: 'Other',
          year: '5',
          cost: null
        },
        {
          id: '0b0e99e1-2086-463d-8979-3759a2f78a05',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Development',
          year: '1',
          cost: null
        },
        {
          id: 'ab29123e-330c-4ec5-9dd3-dfc439b81aaf',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Development',
          year: '2',
          cost: null
        },
        {
          id: '893ac631-d072-483b-9ff0-34c46f3b3770',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Development',
          year: '3',
          cost: null
        },
        {
          id: '92baacea-a7a7-41fe-8f6f-320200caadc7',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Development',
          year: '4',
          cost: null
        },
        {
          id: 'fed82864-fea3-48b2-a9a4-d73a9edfde67',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Development',
          year: '5',
          cost: null
        },
        {
          id: 'a271ecb6-4f4c-4fbe-a2d7-aba74cce3c52',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '1',
          cost: null
        },
        {
          id: 'ed5645ab-f51c-494b-99af-49bb9cc91beb',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '2',
          cost: null
        },
        {
          id: '4441df40-00ac-4083-9597-fa5189c1e192',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '3',
          cost: null
        },
        {
          id: '1e917162-8b40-4ece-8f4f-df341a2162a5',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '4',
          cost: null
        },
        {
          id: '72c62bfc-9f3e-44fb-9349-b274faacce29',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '5',
          cost: null
        },
        {
          id: '8de1057c-63f6-4ebd-ab6f-d3918df940bd',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Help desk/call center',
          year: '1',
          cost: null
        },
        {
          id: 'c643955c-54c6-4df2-9753-4bffcd14caba',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Help desk/call center',
          year: '2',
          cost: null
        },
        {
          id: 'fc2ca540-4a9a-4268-8bb8-ad01146819fb',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Help desk/call center',
          year: '3',
          cost: null
        },
        {
          id: 'f061bc56-aa78-49c8-ab82-679ae1cbc782',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Help desk/call center',
          year: '4',
          cost: null
        },
        {
          id: 'e5fb4aa2-be54-4900-955a-85ede46edcd8',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Help desk/call center',
          year: '5',
          cost: null
        },
        {
          id: '628a2a8d-f3cb-46ee-9014-d402b772da95',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Software licenses',
          year: '1',
          cost: null
        },
        {
          id: 'fd8fd21a-aecd-4357-9ecd-4434fbadd240',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Software licenses',
          year: '2',
          cost: null
        },
        {
          id: '02d2d679-2cd9-4c92-a64e-d7c32f16f6cc',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Software licenses',
          year: '3',
          cost: null
        },
        {
          id: '51a26792-25f6-44f6-9a16-6d8f07914a83',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Software licenses',
          year: '4',
          cost: null
        },
        {
          id: 'c46e2f9d-d594-478a-aa78-02561ab85279',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Software licenses',
          year: '5',
          cost: null
        },
        {
          id: 'd515d617-fc77-4705-987d-b9a4fe643af3',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '1',
          cost: null
        },
        {
          id: '4d8aedec-346b-4060-8f80-d6229ce84bb7',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '2',
          cost: null
        },
        {
          id: '586ba4fb-fa34-471d-9295-561b5fa1da8d',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '3',
          cost: null
        },
        {
          id: '7b59c0a6-38b5-421c-b07f-d61849cdeeef',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '4',
          cost: null
        },
        {
          id: 'b5d2ab6d-bd64-4410-b69c-86ccacc3881c',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '5',
          cost: null
        },
        {
          id: '9b75aa6f-0525-4c9c-8463-3889a0721151',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Infrastructure',
          year: '1',
          cost: null
        },
        {
          id: '35955b50-6957-4361-8f6f-35e9be219f1b',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Infrastructure',
          year: '2',
          cost: null
        },
        {
          id: 'd2a69ee8-7ccb-4595-86c7-f15448da2028',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Infrastructure',
          year: '3',
          cost: null
        },
        {
          id: '8440ebcb-0d79-4a5a-a1c5-97deeca0b381',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Infrastructure',
          year: '4',
          cost: null
        },
        {
          id: '05e6d1a5-c15f-44bf-bf04-947710553fca',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Infrastructure',
          year: '5',
          cost: null
        },
        {
          id: 'fc25745a-3ed1-4c52-947a-d2f74145c587',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '1',
          cost: null
        },
        {
          id: '65892267-7f57-4180-90d3-0b2e9b21bce4',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '2',
          cost: null
        },
        {
          id: '23ccd8c9-1e6f-4e88-9862-c46bf0a11890',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '3',
          cost: null
        },
        {
          id: 'a7c3ea22-07ab-4ec4-9af3-0924ebadaf62',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '4',
          cost: null
        },
        {
          id: '2f3c9150-1e56-4909-b71a-7b05b1a18def',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '5',
          cost: null
        },
        {
          id: '90ed8a05-eb1d-425d-8508-46724d7243f5',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Other',
          year: '1',
          cost: null
        },
        {
          id: '6e529e05-ac52-4607-b529-96fcbc3e41df',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Other',
          year: '2',
          cost: null
        },
        {
          id: 'd439bf89-e194-4f84-b45f-ae30784967f3',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Other',
          year: '3',
          cost: null
        },
        {
          id: 'ecd5796d-888b-41d0-9b9d-d9d03e7bdbf9',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
          solution: 'A',
          phase: 'Other',
          year: '4',
          cost: null
        },
        {
          id: '98d6a678-2158-4a2f-84cc-440d0a2f0d43',
          business_case: '8bc0a6f1-31f2-42d9-898b-7fa58a4a824b',
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

    it('transforms preferred solution for app', () => {
      const preferredSolution = {
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
              year1: '1',
              year2: '4',
              year3: '',
              year4: '8',
              year5: '10'
            }
          },
          operationsMaintenance: {
            label: 'Operations and Maintenance',
            type: 'primary',
            isPresent: true,
            years: {
              year1: '2',
              year2: '',
              year3: '6',
              year4: '9',
              year5: '11'
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
              year1: '3',
              year2: '5',
              year3: '7',
              year4: '',
              year5: '12'
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
      };
      expect(
        prepareBusinessCaseForApp(testDataFromApi).preferredSolution
      ).toEqual(preferredSolution);
    });
  });

  describe('prepareBusinessCaseForApi', () => {
    it('prepares business case data for API', () => {
      // ONLY checking Preferred solution lifecycle lines in this test
      // other solutions should behave the same
      const testBusinessCase: BusinessCaseModel = {
        ...businessCaseInitialData,
        preferredSolution: {
          title: '',
          summary: '',
          acquisitionApproach: '',
          security: {
            isApproved: null,
            isBeingReviewed: ''
          },
          hosting: {
            type: '',
            location: ''
          },
          hasUserInterface: '',
          pros: '',
          cons: '',
          estimatedLifecycleCost: {
            development: {
              label: 'Development',
              type: 'primary',
              isPresent: true,
              years: {
                year1: '500',
                year2: '500',
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
                year1: '1000',
                year2: '',
                year3: '1000',
                year4: '',
                year5: ''
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
                year2: '',
                year3: '',
                year4: '',
                year5: ''
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
          },
          costSavings: ''
        }
      };

      const preferredLifecycleLines = [
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
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Development',
          year: '4',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Development',
          year: '5',
          cost: null
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
          cost: null
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
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Operations and Maintenance',
          year: '5',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '1',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '2',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '3',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '4',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Help desk/call center',
          year: '5',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '1',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '2',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '3',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '4',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Software licenses',
          year: '5',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '1',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '2',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '3',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '4',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Planning, support, and professional services',
          year: '5',
          cost: null
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
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '3',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '4',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Infrastructure',
          year: '5',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '1',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '2',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '3',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '4',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'OIT services, tools, and pilots',
          year: '5',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Other',
          year: '1',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Other',
          year: '2',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Other',
          year: '3',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Other',
          year: '4',
          cost: null
        },
        {
          solution: 'Preferred',
          phase: 'Other',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Development',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Development',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Development',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Development',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Development',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Operations and Maintenance',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Help desk/call center',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Help desk/call center',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Help desk/call center',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Help desk/call center',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Help desk/call center',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Software licenses',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Software licenses',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Software licenses',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Software licenses',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Software licenses',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Planning, support, and professional services',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Infrastructure',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Infrastructure',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Infrastructure',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Infrastructure',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Infrastructure',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'OIT services, tools, and pilots',
          year: '5',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Other',
          year: '1',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Other',
          year: '2',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Other',
          year: '3',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Other',
          year: '4',
          cost: null
        },
        {
          solution: 'A',
          phase: 'Other',
          year: '5',
          cost: null
        }
      ];

      expect(
        prepareBusinessCaseForApi(testBusinessCase).lifecycleCostLines
      ).toEqual(expect.arrayContaining(preferredLifecycleLines));
    });
  });
});
