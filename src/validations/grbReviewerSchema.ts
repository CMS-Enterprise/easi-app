import i18next from 'i18next';
import * as Yup from 'yup';

import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';

const CreateGRBReviewerSchema = Yup.object().shape({
  userAccount: Yup.object()
    .shape({
      username: Yup.string(),
      commonName: Yup.string()
    })
    .test(
      'required',
      i18next.t('Select a GRB member'),
      value => !!value.commonName && !!value.username
    ),
  votingRole: Yup.string()
    .oneOf(grbReviewerVotingRoles)
    .required(i18next.t('Select a voting role')),
  grbRole: Yup.string()
    .oneOf(grbReviewerRoles)
    .required(i18next.t('Select a GRB role'))
});

export default CreateGRBReviewerSchema;
