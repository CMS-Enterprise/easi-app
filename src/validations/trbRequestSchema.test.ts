import {
  TRBApplicationDevelopmentOption,
  TRBCloudAndInfrastructureOption,
  TRBDataAndDataManagementOption,
  TRBDocumentCommonType,
  TRBGovernmentProcessesAndPoliciesOption,
  TRBNetworkAndSecurityOption,
  TRBOtherTechnicalTopicsOption,
  TRBTechnicalReferenceArchitectureOption
} from 'types/graphql-global-types';

import {
  basicSchema,
  documentSchema,
  subjectAreasSchema,
  TrbFormInputSubjectAreas,
  TrbRequestFormBasic
} from './trbRequestSchema';

describe('TRB Basic Form schema validation', () => {
  const minimumRequiredForm = {
    name: 'Request Name',
    component: 'Center for Medicaid and CHIP Services',
    needsAssistanceWith: 'Needs assist',
    hasSolutionInMind: false,
    whereInProcess: 'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
    hasExpectedStartEndDates: false,
    collabGroups: ['SECURITY'],
    collabDateSecurity: 'Fall 2021'
  };

  it('passes backend input validation', async () => {
    await expect(
      basicSchema.isValid(minimumRequiredForm)
    ).resolves.toBeTruthy();
  });

  it.each(['whereInProcess', 'collabGroups'])(
    `errors on other values in enum based field: %s`,
    async inputKey => {
      let optionVal: any = 'buz';
      if (inputKey === 'collabGroups') {
        optionVal = [optionVal];
      }
      await expect(
        basicSchema.fields[inputKey as keyof TrbRequestFormBasic].isValid(
          optionVal
        )
      ).resolves.toBeFalsy();
    }
  );

  const freeTextDate = 'Q1 2021';

  it.each([
    {
      parent: { hasSolutionInMind: true },
      empty: {
        proposedSolution: ''
      },
      filled: {
        proposedSolution: 'solution'
      }
    },
    {
      parent: { whereInProcess: 'OTHER' },
      empty: {
        whereInProcessOther: ''
      },
      filled: {
        whereInProcessOther: 'process'
      }
    },
    {
      parent: {
        collabGroups: ['SECURITY']
      },
      empty: {
        collabDateSecurity: ''
      },
      filled: {
        collabDateSecurity: freeTextDate
      }
    },
    {
      parent: {
        collabGroups: ['ENTERPRISE_ARCHITECTURE']
      },
      empty: {
        collabDateEnterpriseArchitecture: ''
      },
      filled: {
        collabDateEnterpriseArchitecture: freeTextDate
      }
    },
    {
      parent: {
        collabGroups: ['CLOUD']
      },
      empty: {
        collabDateCloud: ''
      },
      filled: {
        collabDateCloud: freeTextDate
      }
    },
    {
      parent: {
        collabGroups: ['PRIVACY_ADVISOR']
      },
      empty: {
        collabDatePrivacyAdvisor: ''
      },
      filled: {
        collabDatePrivacyAdvisor: freeTextDate
      }
    },
    {
      parent: {
        collabGroups: ['GOVERNANCE_REVIEW_BOARD']
      },
      empty: {
        collabDateGovernanceReviewBoard: ''
      },
      filled: {
        collabDateGovernanceReviewBoard: freeTextDate
      }
    },
    {
      parent: {
        collabGroups: ['OTHER']
      },
      empty: {
        collabDateOther: '',
        collabGroupOther: ''
      },
      filled: {
        collabDateOther: freeTextDate,
        collabGroupOther: 'other group'
      }
    }
  ])('validates conditional fields: %j', async ({ parent, empty, filled }) => {
    await expect(
      basicSchema.validate({
        ...minimumRequiredForm,
        ...parent,
        ...empty
      })
    ).rejects.toThrow('required field');

    await expect(
      basicSchema.isValid({
        ...minimumRequiredForm,
        ...parent,
        ...filled
      })
    ).resolves.toBeTruthy();
  });

  it('requires at least one expected start or end date', async () => {
    await expect(
      basicSchema.isValid({
        ...minimumRequiredForm,
        hasExpectedStartEndDates: true,
        expectedStartDate: freeTextDate,
        expectedEndDate: ''
      })
    ).resolves.toBeTruthy();
    await expect(
      basicSchema.isValid({
        ...minimumRequiredForm,
        hasExpectedStartEndDates: true,
        expectedStartDate: '',
        expectedEndDate: freeTextDate
      })
    ).resolves.toBeTruthy();
    await expect(
      basicSchema.isValid({
        ...minimumRequiredForm,
        hasExpectedStartEndDates: true,
        expectedStartDate: '',
        expectedEndDate: ''
      })
    ).resolves.toBeFalsy();
  });
});

describe('TRB Subject Areas Form schema validation', () => {
  // Subject areas can be an empty form

  it.each([
    {
      field: 'subjectAreaTechnicalReferenceArchitecture',
      options: TRBTechnicalReferenceArchitectureOption
    },
    {
      field: 'subjectAreaNetworkAndSecurity',
      options: TRBNetworkAndSecurityOption
    },
    {
      field: 'subjectAreaCloudAndInfrastructure',
      options: TRBCloudAndInfrastructureOption
    },
    {
      field: 'subjectAreaApplicationDevelopment',
      options: TRBApplicationDevelopmentOption
    },
    {
      field: 'subjectAreaDataAndDataManagement',
      options: TRBDataAndDataManagementOption
    },
    {
      field: 'subjectAreaGovernmentProcessesAndPolicies',
      options: TRBGovernmentProcessesAndPoliciesOption
    },
    {
      field: 'subjectAreaOtherTechnicalTopics',
      options: TRBOtherTechnicalTopicsOption
    }
  ])('validates field options %j', async ({ field, options }) => {
    // All valid single options
    await expect(
      Promise.all(
        Object.values(options).map(opt => {
          return subjectAreasSchema.fields[
            field as keyof TrbFormInputSubjectAreas
          ].isValid([opt]);
        })
      )
    ).resolves.toEqual(expect.arrayContaining([true]));

    // Missing/invalid option value
    await expect(
      Promise.all(
        Object.values(options).map(opt => {
          return subjectAreasSchema.fields[
            field as keyof TrbFormInputSubjectAreas
          ].isValid(['']);
        })
      )
    ).resolves.toEqual(expect.arrayContaining([false]));

    // All valid option values
    await expect(
      subjectAreasSchema.fields[
        field as keyof TrbFormInputSubjectAreas
      ].isValid(Object.values(options))
    ).resolves.toEqual(true);

    // Invalid with valid option values
    await expect(
      subjectAreasSchema.fields[
        field as keyof TrbFormInputSubjectAreas
      ].isValid(Object.values(options).concat(''))
    ).resolves.toEqual(false);

    // Valid other text
    await expect(
      subjectAreasSchema.isValid({
        [field]: ['OTHER'],
        [`${field}Other`]: 'test'
      })
    ).resolves.toBeTruthy();

    // Missing other text
    await expect(
      subjectAreasSchema.validate({
        [field]: ['OTHER'],
        [`${field}Other`]: ''
      })
    ).rejects.toThrow(/other is a required field/i);
  });
});

describe('TRB Supporting Documents Form schema validation', () => {
  it('passes minimum required inputs', async () => {
    await expect(
      documentSchema.isValid({
        fileData: { name: 'test.pdf', size: 100, type: 'application/pdf' },
        documentType: 'ARCHITECTURE_DIAGRAM'
      })
    ).resolves.toBeTruthy();
  });

  it('errors on empty', async () => {
    await expect(documentSchema.isValid({})).resolves.toBeFalsy();
  });

  it('validates documentType field options', async () => {
    // Valid single option
    await expect(
      Promise.all(
        Object.values(TRBDocumentCommonType).map(opt =>
          documentSchema.fields.documentType.isValid(opt)
        )
      )
    ).resolves.toEqual(expect.arrayContaining([true]));

    // Missing/invalid option value
    await expect(
      documentSchema.fields.documentType.isValid('')
    ).resolves.toEqual(false);

    // Invalid multiple options
    await expect(
      documentSchema.fields.documentType.isValid([
        'ARCHITECTURE_DIAGRAM',
        'BUSINESS_CASE'
      ])
    ).resolves.toEqual(false);
  });

  it('requires other text when toggled on', async () => {
    // Valid other text
    await expect(
      documentSchema.isValid({
        fileData: { name: 'test.pdf', size: 0, type: 'application/pdf' },
        documentType: 'OTHER',
        otherTypeDescription: 'test'
      })
    ).resolves.toBeTruthy();

    // Missing other text
    await expect(
      documentSchema.validate({
        fileData: { name: 'test.pdf', size: 0, type: 'application/pdf' },
        documentType: 'OTHER',
        otherTypeDescription: ''
      })
    ).rejects.toThrow(/otherTypeDescription is a required field/i);
  });
});
