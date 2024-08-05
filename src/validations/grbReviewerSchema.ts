import i18next from 'i18next';
import * as Yup from 'yup';

import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';
import { SystemIntakeGRBReviewer } from 'queries/types/SystemIntakeGRBReviewer';

const CreateGRBReviewerSchema = (grbReviewers: SystemIntakeGRBReviewer[]) =>
  Yup.object().shape({
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
      .when('$action', {
        is: 'add',
        then: schema =>
          schema.test(
            'duplicate',
            i18next.t('User has already been added as a GRB reviewer'),
            value => {
              return !grbReviewers.find(
                reviewer => reviewer.userAccount.username === value.username
              );
            }
          )
      }),
    votingRole: Yup.string()
      .oneOf(grbReviewerVotingRoles)
      .required(i18next.t('Select a voting role')),
    grbRole: Yup.string()
      .oneOf(grbReviewerRoles)
      .required(i18next.t('Select a GRB role'))
  });

export default CreateGRBReviewerSchema;
