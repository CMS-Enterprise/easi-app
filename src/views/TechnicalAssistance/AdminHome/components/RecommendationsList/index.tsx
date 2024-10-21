import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from 'components/shared/Alert';
import { TRBRecommendation } from 'queries/types/TRBRecommendation';
import { MockTRBRecommendationsObject } from 'views/TechnicalAssistance/GuidanceLetterForm/mockTRBRecommendations';

import RemoveRecommendationModal from '../RemoveRecommendationModal/Index';

import RecommendationsCategory from './RecommendationsCategory';

type RecommendationsListProps = {
  recommendations: MockTRBRecommendationsObject;
  trbRequestId: string;
  /** Optional function to set error message if order mutation fails */
  setReorderError?: (error: string | null) => void;
  /** If false, hides edit/remove buttons and reorder controls */
  editable?: boolean;
  edit?: (recommendation: TRBRecommendation) => void;
  remove?: (recommendation: TRBRecommendation) => void;
  className?: string;
};

/**
 * Displays list of TRB guidance letter recommendations
 * with optional buttons to edit, remove, and order recommendations
 */
export default function RecommendationsList({
  recommendations,
  trbRequestId,
  setReorderError,
  editable = true,
  edit,
  remove,
  className
}: RecommendationsListProps) {
  const { t } = useTranslation('technicalAssistance');

  const [recommendationToRemove, setRecommendationToRemove] =
    useState<TRBRecommendation | null>(null);

  const hasRecommendations =
    recommendations.RECOMMENDATION.length > 0 ||
    recommendations.REQUIREMENT.length > 0 ||
    recommendations.CONSIDERATION.length > 0;

  // Clear error on initial render
  useEffect(() => {
    setReorderError?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      {remove && (
        <RemoveRecommendationModal
          modalProps={{
            isOpen: !!recommendationToRemove,
            closeModal: () => setRecommendationToRemove(null)
          }}
          handleDelete={() =>
            recommendationToRemove && remove(recommendationToRemove)
          }
        >
          <p>
            {t('guidanceLetterForm.modal.removingTitle', {
              title: recommendationToRemove?.title
            })}
          </p>
        </RemoveRecommendationModal>
      )}

      {hasRecommendations && editable && (
        <Alert type="info" slim className="margin-bottom-4">
          {t('guidanceLetterForm.reorderGuidance')}
        </Alert>
      )}

      {recommendations.REQUIREMENT.length > 0 && (
        <RecommendationsCategory
          recommendations={recommendations.REQUIREMENT}
          trbRequestId={trbRequestId}
          editable={editable}
          edit={edit}
          setRecommendationToRemove={remove && setRecommendationToRemove}
          setReorderError={setReorderError}
        />
      )}

      {recommendations.RECOMMENDATION.length > 0 && (
        <RecommendationsCategory
          recommendations={recommendations.RECOMMENDATION}
          trbRequestId={trbRequestId}
          editable={editable}
          edit={edit}
          setRecommendationToRemove={remove && setRecommendationToRemove}
          setReorderError={setReorderError}
        />
      )}

      {recommendations.CONSIDERATION.length && (
        <RecommendationsCategory
          recommendations={recommendations.CONSIDERATION}
          trbRequestId={trbRequestId}
          editable={editable}
          edit={edit}
          setRecommendationToRemove={remove && setRecommendationToRemove}
          setReorderError={setReorderError}
        />
      )}
    </div>
  );
}
