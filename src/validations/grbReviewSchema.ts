import { SystemIntakeGRBReviewerFragment } from 'gql/generated/graphql';
import i18next from 'i18next';
import * as Yup from 'yup';
import { MixedSchema } from 'yup/lib/mixed';

import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';
import { SystemIntakeGRBReviewType } from 'types/graphql-global-types';
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
    recordingPasscode: Yup.string(),
    transcriptFileData: Yup.mixed(),
    transcriptLink: Yup.string()
  },
  // Prevents cyclic dependency error
  [['recordingLink', 'presentationDeckFileData']]
);

export const GrbReviewFormSchema = {
  grbReviewType: Yup.mixed()
    .oneOf(extractObjectKeys(SystemIntakeGRBReviewType))
    .required(),
  presentation: SetGRBPresentationLinksSchema,
  participants: CreateGRBReviewersSchema
};
