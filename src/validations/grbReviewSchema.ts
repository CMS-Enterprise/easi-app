import {
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import i18next from 'i18next';
import * as Yup from 'yup';
import { MixedSchema } from 'yup/lib/mixed';

import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';
import extractObjectKeys from 'utils/extractObjectKeys';

/** GRB Reviewer for IT Governance request */
export const GRBReviewerSchema = Yup.object().shape({
  userAccount: Yup.object()
    .shape({
      username: Yup.string(),
      commonName: Yup.string()
    })
    .test(
      'required',
      i18next.t('Select a GRB member'),
      value => !!value.commonName && !!value.username
    )
    // Only check for duplicate reviewers when adding new reviewer
    .when('$errorOnDuplicate', {
      is: true,
      then: schema =>
        schema.when(
          '$initialGRBReviewers',
          (initialGRBReviewers: SystemIntakeGRBReviewerFragment[]) =>
            schema.test(
              'duplicate',
              i18next.t('User has already been added as a GRB reviewer'),
              value =>
                !initialGRBReviewers.find(
                  reviewer => reviewer.userAccount.username === value.username
                )
            )
        )
    }),
  votingRole: Yup.string()
    .oneOf(grbReviewerVotingRoles)
    .required(i18next.t('Select a voting role')),
  grbRole: Yup.string()
    .oneOf(grbReviewerRoles)
    .required(i18next.t('Select a GRB role'))
});

/** Array of GRB reviewers being added to IT Governance request */
export const CreateGRBReviewersSchema = Yup.object({
  grbReviewers: Yup.array(GRBReviewerSchema).min(
    1,
    i18next.t('Please select at least one GRB reviewer')
  )
});

export const SetGRBParticipantsAsyncSchema = Yup.object({
  grbReviewers: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        grbRole: Yup.string().required(),
        votingRole: Yup.string()
          .oneOf(['VOTING', 'NON_VOTING', 'ALTERNATE'])
          .required(),
        userAccount: Yup.object().shape({
          id: Yup.string().required(),
          username: Yup.string().required(),
          commonName: Yup.string().required(),
          email: Yup.string().email().required()
        })
      })
    )
    .test(
      'at-least-five-voting',
      i18next.t('grbReview:setUpGrbReviewForm.minFive'),
      (reviewers = []) =>
        reviewers.filter(r => r.votingRole === 'VOTING').length >= 5
    ),
  grbReviewAsyncEndDate: Yup.date().required(
    i18next.t('grbReview:setUpGrbReviewForm.invalidDate')
  )
});

/** Presentation links schema */
export const SetGRBPresentationLinksSchema = Yup.object().shape(
  {
    // Form requires either recordingLink or presentationDeckFileData fields
    recordingLink: Yup.string().when('presentationDeckFileData', {
      is: (value?: MixedSchema) => !value,
      then: Yup.string().required(
        i18next.t('grbReview:presentationLinks.requiredField')
      ),
      otherwise: Yup.string()
    }),
    presentationDeckFileData: Yup.mixed().when('recordingLink', {
      is: (value?: string) => !value,
      then: Yup.mixed().required(
        i18next.t('grbReview:presentationLinks.requiredField')
      ),
      otherwise: Yup.mixed()
    }),

    // Optional fields
    recordingPasscode: Yup.string().nullable(),
    transcriptFileData: Yup.mixed(),
    transcriptLink: Yup.string().nullable()
  },
  // Prevents cyclic dependency error
  [['recordingLink', 'presentationDeckFileData']]
);

export const GrbReviewTypeSchema = Yup.object().shape({
  grbReviewType: Yup.mixed()
    .oneOf(extractObjectKeys(SystemIntakeGRBReviewType))
    .required()
});

export const GrbPresentationSchema = Yup.object().shape({
  grbDate: Yup.string()
    .nullable()
    .when('grbReviewType', {
      is: (value?: SystemIntakeGRBReviewType) =>
        value === SystemIntakeGRBReviewType.STANDARD,
      then: Yup.string().required(
        i18next.t('grbReview:presentationLinks.requiredField')
      ),
      otherwise: Yup.string().nullable()
    })
});

export const GrbReviewFormSchema = {
  reviewType: GrbReviewTypeSchema,
  presentation: GrbPresentationSchema,
  participants: SetGRBParticipantsAsyncSchema
};

export const GRBVoteSchema = (originalComment?: string | null) =>
  Yup.object({
    voteComment: Yup.string()
      .required(
        i18next.t<string>('grbReview:reviewTask.voting.modal.validation')
      )
      .test(
        'is-not-original-value',
        i18next.t<string>(
          'grbReview:reviewTask.voting.modal.validationMustChange'
        ),
        value => {
          return value !== originalComment;
        }
      )
  });
