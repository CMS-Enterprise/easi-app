import { SystemIntakeGRBReviewerFragment } from 'gql/generated/graphql';
import i18next from 'i18next';
import * as Yup from 'yup';

import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';

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
    recordingLink: Yup.string().when(
      ['$formType', 'presentationDeckFileData'],
      {
        is: (
          formType: 'add' | 'edit',
          presentationDeckFileData?: File | null
        ) => {
          if (formType === 'add' && !presentationDeckFileData) {
            return true;
          }

          // Field is required if editing and presentation deck is cleared
          if (formType === 'edit' && presentationDeckFileData === null) {
            return true;
          }

          return false;
        },
        then: Yup.string().required(
          i18next.t('grbReview:presentationLinks.emptyFormError')
        ),
        otherwise: Yup.string().nullable()
      }
    ),
    presentationDeckFileData: Yup.mixed().test(
      'required',
      i18next.t('grbReview:presentationLinks.emptyFormError'),
      (value, context) => {
        const { recordingLink } = context.parent;

        // If `recordingLink` is empty, `presentationDeckFileData` cannot be null
        // undefined passes because it means there is an existing file
        if (!recordingLink) {
          return value !== null;
        }

        return true;
      }
    ),

    // Optional fields
    recordingPasscode: Yup.string().nullable(),
    transcriptFileData: Yup.mixed(),
    transcriptLink: Yup.string().nullable()
  },
  // Prevents cyclic dependency error
  [['recordingLink', 'presentationDeckFileData']]
);
