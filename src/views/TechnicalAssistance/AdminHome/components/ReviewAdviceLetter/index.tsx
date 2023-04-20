import React from 'react';
import { useTranslation } from 'react-i18next';

import SectionWrapper from 'components/shared/SectionWrapper';
import { GetTrbAdviceLetter_trbRequest_adviceLetter as AdviceLetter } from 'queries/types/GetTrbAdviceLetter';
import { formatDateLocal } from 'utils/date';

import RecommendationsList from './RecommendationsList';

/**
 * Displays advice letter for review
 */
const ReviewAdviceLetter = ({
  adviceLetter,
  showDateSent = true,
  showSectionBorders = true
}: {
  adviceLetter: AdviceLetter;
  showDateSent?: boolean;
  showSectionBorders?: boolean;
}) => {
  const { t } = useTranslation('technicalAssistance');

  const { recommendations } = adviceLetter;

  return (
    <div>
      {/* Date sent */}
      {showDateSent && (
        <>
          <p className="text-bold margin-bottom-0">
            {t('adviceLetter.sendDate')}
          </p>
          <p className="margin-top-1">
            {adviceLetter.dateSent
              ? formatDateLocal(adviceLetter.dateSent, 'MMMM d, yyyy')
              : t('adviceLetter.notYetSent')}
          </p>
        </>
      )}

      {/* What we heard / meeting summary */}
      <SectionWrapper
        borderTop={showSectionBorders}
        className="margin-top-6 padding-top-1"
      >
        <h2>{t('adviceLetter.whatWeHeard')}</h2>
        <p className="text-bold margin-top-4 margin-bottom-0">
          {t('adviceLetter.meetingSummary')}
        </p>
        <p className="margin-top-1 line-height-body-5">
          {adviceLetter.meetingSummary}
        </p>
      </SectionWrapper>

      {/* Recommendations */}
      <SectionWrapper
        borderTop={showSectionBorders}
        className="margin-top-6 padding-top-1"
      >
        <h2>{t('adviceLetter.whatWeRecommend')}</h2>
        {
          // If no recommendations, return text
          recommendations.length === 0 ? (
            <p>{t('adviceLetter.notSpecified')}</p>
          ) : (
            <RecommendationsList
              type="admin"
              recommendations={recommendations}
            />
          )
        }
      </SectionWrapper>

      {/* Next steps */}
      <SectionWrapper
        borderTop={showSectionBorders}
        className="margin-top-6 padding-top-1"
      >
        <h2>{t('adviceLetter.nextSteps')}</h2>

        <p className="text-bold margin-top-4 margin-bottom-1">
          {t('adviceLetter.nextSteps')}
        </p>
        <p className="margin-top-1 line-height-body-5">
          {adviceLetter.nextSteps || t('adviceLetter.notSpecified')}
        </p>

        {/* Follow up */}
        <p className="text-bold margin-top-3 margin-bottom-1">
          {t('adviceLetter.followup')}
        </p>
        <p className="margin-top-1 line-height-body-5">
          {adviceLetter.isFollowupRecommended
            ? t(`Yes, ${adviceLetter.followupPoint}`)
            : t('adviceLetter.notSpecified')}
        </p>
      </SectionWrapper>
    </div>
  );
};

export default ReviewAdviceLetter;
