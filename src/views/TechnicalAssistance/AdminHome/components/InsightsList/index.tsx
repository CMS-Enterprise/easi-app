import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TRBGuidanceLetterInsightCategory,
  TRBGuidanceLetterInsightFragment,
  useGetTRBGuidanceLetterInsightsQuery
} from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';

import RemoveInsightModal from '../RemoveInsightModal/Index';

import InsightsCategory from './InsightsCategory';

type InsightsListProps = {
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

  const { data, loading } = useGetTRBGuidanceLetterInsightsQuery({
    variables: {
      id: trbRequestId
    }
  });

  const insights = data?.trbRequest?.guidanceLetter?.insights;

  // Clear error on initial render
  useEffect(() => {
    setReorderError?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if ((loading && !insights) || !insights) {
    return <PageLoading />;
  }

  const requirements = insights.filter(
    insight => insight.category === TRBGuidanceLetterInsightCategory.REQUIREMENT
  );

  const recommendations = insights.filter(
    insight =>
      insight.category === TRBGuidanceLetterInsightCategory.RECOMMENDATION
  );

  const considerations = insights.filter(
    insight =>
      insight.category === TRBGuidanceLetterInsightCategory.CONSIDERATION
  );

  const uncategorized = insights.filter(
    insight =>
      insight.category === TRBGuidanceLetterInsightCategory.UNCATEGORIZED
  );

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
        category={TRBGuidanceLetterInsightCategory.REQUIREMENT}
        trbRequestId={trbRequestId}
        editable={editable}
        edit={edit}
        setInsightToRemove={remove && setInsightToRemove}
        setReorderError={setReorderError}
      />

      <InsightsCategory
        insights={recommendations}
        category={TRBGuidanceLetterInsightCategory.RECOMMENDATION}
        trbRequestId={trbRequestId}
        editable={editable}
        edit={edit}
        setInsightToRemove={remove && setInsightToRemove}
        setReorderError={setReorderError}
      />

      <InsightsCategory
        insights={considerations}
        category={TRBGuidanceLetterInsightCategory.CONSIDERATION}
        trbRequestId={trbRequestId}
        editable={editable}
        edit={edit}
        setInsightToRemove={remove && setInsightToRemove}
        setReorderError={setReorderError}
      />

      {uncategorized.length > 0 && (
        <InsightsCategory
          insights={uncategorized}
          category={TRBGuidanceLetterInsightCategory.UNCATEGORIZED}
          trbRequestId={trbRequestId}
          editable={editable}
          edit={edit}
          setInsightToRemove={remove && setInsightToRemove}
          setReorderError={setReorderError}
        />
      )}
    </div>
  );
}
