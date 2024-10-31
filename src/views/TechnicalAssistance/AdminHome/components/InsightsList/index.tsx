import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TRBGuidanceLetterInsightFragment,
  TRBGuidanceLetterRecommendationCategory
} from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';

import RemoveInsightModal from '../RemoveInsightModal/Index';

import InsightsCategory from './InsightsCategory';

type InsightsListProps = {
  insights: TRBGuidanceLetterInsightFragment[];
  trbRequestId: string;
  /** Optional function to set error message if order mutation fails */
  setReorderError?: (error: string | null) => void;
  /** If false, hides edit/remove buttons and reorder controls */
  editable?: boolean;
  edit?: (insight: TRBGuidanceLetterInsightFragment) => void;
  remove?: (insight: TRBGuidanceLetterInsightFragment) => void;
  className?: string;
};

/**
 * Displays list of TRB guidance letter guidance and insights
 * with optional buttons to edit, remove, and order insights
 */
export default function InsightsList({
  insights,
  trbRequestId,
  setReorderError,
  editable = true,
  edit,
  remove,
  className
}: InsightsListProps) {
  const { t } = useTranslation('technicalAssistance');

  const [insightToRemove, setInsightToRemove] =
    useState<TRBGuidanceLetterInsightFragment | null>(null);

  const requirements = useMemo(
    () =>
      insights.filter(
        insight =>
          insight.category ===
          TRBGuidanceLetterRecommendationCategory.REQUIREMENT
      ),
    [insights]
  );

  const recommendations = useMemo(
    () =>
      insights.filter(
        insight =>
          insight.category ===
          TRBGuidanceLetterRecommendationCategory.RECOMMENDATION
      ),
    [insights]
  );

  const considerations = useMemo(
    () =>
      insights.filter(
        insight =>
          insight.category ===
          TRBGuidanceLetterRecommendationCategory.CONSIDERATION
      ),
    [insights]
  );

  // Clear error on initial render
  useEffect(() => {
    setReorderError?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      {remove && (
        <RemoveInsightModal
          modalProps={{
            isOpen: !!insightToRemove,
            closeModal: () => setInsightToRemove(null)
          }}
          handleDelete={() => insightToRemove && remove(insightToRemove)}
        >
          <p>
            {t('guidanceLetterForm.modal.removingTitle', {
              title: insightToRemove?.title
            })}
          </p>
        </RemoveInsightModal>
      )}

      {insights.length > 0 && editable && (
        <Alert type="info" slim className="margin-bottom-4">
          {t('guidanceLetterForm.reorderGuidance')}
        </Alert>
      )}

      <InsightsCategory
        insights={requirements}
        category={TRBGuidanceLetterRecommendationCategory.REQUIREMENT}
        trbRequestId={trbRequestId}
        editable={editable}
        edit={edit}
        setInsightToRemove={remove && setInsightToRemove}
        setReorderError={setReorderError}
      />

      <InsightsCategory
        insights={recommendations}
        category={TRBGuidanceLetterRecommendationCategory.RECOMMENDATION}
        trbRequestId={trbRequestId}
        editable={editable}
        edit={edit}
        setInsightToRemove={remove && setInsightToRemove}
        setReorderError={setReorderError}
      />

      <InsightsCategory
        insights={considerations}
        category={TRBGuidanceLetterRecommendationCategory.CONSIDERATION}
        trbRequestId={trbRequestId}
        editable={editable}
        edit={edit}
        setInsightToRemove={remove && setInsightToRemove}
        setReorderError={setReorderError}
      />
    </div>
  );
}
