import i18next from 'i18next';

import { SetGRBPresentationLinksSchema } from './grbReviewSchema';

const mockPresentationDeckFileData = new File(['1'], 'test.pdf', {
  type: 'application/pdf'
});

describe('GRB presentation links form schema validation', () => {
  it('Validates adding links', async () => {
    // Passes with only recording link
    await expect(
      SetGRBPresentationLinksSchema.isValid(
        {
          recordingLink: '123456',
          presentationDeckFileData: null
        },
        { context: { formType: 'add' } }
      )
    ).resolves.toBeTruthy();

    // Passes with only presentation deck
    await expect(
      SetGRBPresentationLinksSchema.isValid(
        {
          recordingLink: '',
          presentationDeckFileData: mockPresentationDeckFileData
        },
        { context: { formType: 'add' } }
      )
    ).resolves.toBeTruthy();

    // Errors on empty recording link and presentation deck fields
    await expect(
      SetGRBPresentationLinksSchema.validate(
        {
          recordingLink: ''
        },
        { context: { formType: 'add' } }
      )
    ).rejects.toThrow(i18next.t('grbReview:presentationLinks.requiredField'));

    // Errors on empty recording link and null presentation deck
    await expect(
      SetGRBPresentationLinksSchema.validate(
        {
          recordingLink: '',
          presentationDeckFileData: null
        },
        { context: { formType: 'add' } }
      )
    ).rejects.toThrow(i18next.t('grbReview:presentationLinks.requiredField'));
  });

  it('Validates editing links', async () => {
    // Passes with recording link when clearing presentation deck
    await expect(
      SetGRBPresentationLinksSchema.isValid(
        {
          recordingLink: '123456',
          presentationDeckFileData: null
        },
        { context: { formType: 'edit' } }
      )
    ).resolves.toBeTruthy();

    // // Passes with empty recording link and existing presentation deck
    // await expect(
    //   SetGRBPresentationLinksSchema.isValid(
    //     {
    //       recordingLink: '',
    //       // Pass undefined to persist existing presentation deck
    //       presentationDeckFileData: undefined
    //     },
    //     { context: { formType: 'edit' } }
    //   )
    // ).resolves.toBeTruthy();

    // Passes with recording link and existing presentation deck
    await expect(
      SetGRBPresentationLinksSchema.isValid(
        {
          recordingLink: 'http://test.com',
          // Pass undefined to persist existing presentation deck
          presentationDeckFileData: undefined
        },
        { context: { formType: 'edit' } }
      )
    ).resolves.toBeTruthy();

    // Errors with empty recording link and empty presentation deck
    await expect(
      SetGRBPresentationLinksSchema.validate(
        {
          recordingLink: '',
          // Pass null to clear existing file data
          presentationDeckFileData: null
        },
        { context: { formType: 'edit' } }
      )
    ).rejects.toThrow(i18next.t('grbReview:presentationLinks.requiredField'));
  });
});
