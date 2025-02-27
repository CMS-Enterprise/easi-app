import { TRBDocumentCommonType } from 'gql/generated/graphql';

import {
  basicSchema,
  documentSchema,
  TrbRequestFormBasic
} from './trbRequestSchema';

describe('TRB Basic Form schema validation', () => {
  const minimumRequiredForm = {
    name: 'Request Name',
    component: 'Center for Medicaid and CHIP Services',
    needsAssistanceWith: 'Needs assist',
    hasSolutionInMind: false,
    whereInProcess: 'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
    hasExpectedStartEndDates: false
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
