import {
  grbReviewerRolesTranslation,
  grbReviewerVotingRolesTranslation
} from 'i18n/en-US/grbReview';
import extractObjectKeys from 'utils/extractObjectKeys';

export const grbReviewerRoles = extractObjectKeys(grbReviewerRolesTranslation);

export const grbReviewerVotingRoles = extractObjectKeys(
  grbReviewerVotingRolesTranslation
);
