import { SystemIntakeGRBReviewerFragment } from 'gql/gen/graphql';
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
