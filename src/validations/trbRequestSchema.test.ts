import { basicSchema, TrbRequestFormBasic } from './trbRequestSchema';

describe('TRB Basic Form schema validation', () => {
  const minimumRequiredForm = {
    name: 'Request Name',
    component: 'Center for Medicaid and CHIP Services',
    needsAssistanceWith: 'Needs assist',
    hasSolutionInMind: false,
    whereInProcess: 'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
    hasExpectedStartEndDates: false,
    collabGroups: ['SECURITY'],
    collabDateSecurity: '2021-10-24T03:29:56.901Z'
  };

  it('passes backend input validation', async () => {
    await expect(
      basicSchema.validate(minimumRequiredForm)
    ).resolves.toBeDefined();
  });

  it(`errors on an empty form`, async () => {
    await expect(basicSchema.validate({})).rejects.toThrow();
  });

  it.each(['whereInProcess', 'collabGroups'])(
    `errors on other values in enum based field: %s`,
    async inputKey => {
      await expect(() => {
        let optionVal: any = 'buz';
        if (inputKey === 'collabGroups') {
          optionVal = [optionVal];
        }
        return basicSchema.fields[
          inputKey as keyof TrbRequestFormBasic
        ].validate(optionVal);
      }).rejects.toThrow();
    }
  );

  const dateval = '2022-10-24T16:39:56.116105Z';

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
      parent: { hasExpectedStartEndDates: true },
      empty: {
        expectedStartDate: '',
        expectedEndDate: ''
      },
      filled: {
        expectedStartDate: dateval,
        expectedEndDate: dateval
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
        collabDateSecurity: dateval
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
        collabDateEnterpriseArchitecture: dateval
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
        collabDateCloud: dateval
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
        collabDatePrivacyAdvisor: dateval
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
        collabDateGovernanceReviewBoard: dateval
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
        collabDateOther: dateval,
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
      basicSchema.validate({
        ...minimumRequiredForm,
        ...parent,
        ...filled
      })
    ).resolves.toBeDefined();
  });
});
