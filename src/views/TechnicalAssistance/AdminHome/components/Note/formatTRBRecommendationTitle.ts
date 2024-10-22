import i18next from 'i18next';

import {
  MockTRBNoteRecommendation,
  MockTRBRecommendation
} from 'views/TechnicalAssistance/GuidanceLetterForm/mockTRBRecommendations';

/** Format recommendation title for display within admin notes */
const formatTRBRecommendationTitle = (
  // TODO: update types
  recommendation: MockTRBRecommendation | MockTRBNoteRecommendation
) => {
  // Get correct key based on if recommendation has been deleted
  const titleKey: string =
    'deletedAt' in recommendation && recommendation?.deletedAt
      ? 'removedRecommendationTitle'
      : 'recommendationTitle';

  return i18next.t(`technicalAssistance:notes.labels.${titleKey}`, {
    context: recommendation.category,
    title: recommendation.title
  });
};

export default formatTRBRecommendationTitle;
