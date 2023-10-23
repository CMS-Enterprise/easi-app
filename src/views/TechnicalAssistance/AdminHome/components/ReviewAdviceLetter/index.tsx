import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { RichTextViewer } from 'components/RichTextEditor';
import SectionWrapper from 'components/shared/SectionWrapper';
import { GetTrbAdviceLetter_trbRequest_adviceLetter as AdviceLetter } from 'queries/types/GetTrbAdviceLetter';
import { TRBRecommendation } from 'queries/types/TRBRecommendation';
import { formatDateLocal } from 'utils/date';

import RecommendationsList from '../RecommendationsList';

type ReviewAdviceLetterProps = {
  adviceLetter: AdviceLetter;
  trbRequestId: string;
  showSectionEditLinks?: boolean;
  recommendationActions?: {
    edit?: (recommendation: TRBRecommendation) => void;
    remove?: (recommendation: TRBRecommendation) => void;
    setReorderError?: (error: string | null) => void;
  };
  showDateSent?: boolean;
  showSectionBorders?: boolean;
  editable?: boolean;
  className?: string;
};

/**
 * Displays advice letter for review
 */
const ReviewAdviceLetter = ({
  adviceLetter,
  trbRequestId,
  showSectionEditLinks = false,
  recommendationActions,
  showDateSent = true,
  showSectionBorders = true,
  editable = true,
  className
}: ReviewAdviceLetterProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { recommendations } = adviceLetter;

  return (
    <div className={className}>
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
        className={classNames({
          'margin-top-6 padding-top-1': showSectionBorders,
          'margin-top-5': !showSectionBorders
        })}
      >
        <h2 className="margin-bottom-1">{t('adviceLetter.whatWeHeard')}</h2>
        {showSectionEditLinks && (
          <UswdsReactLink
            to={`/trb/${trbRequestId}/advice/summary`}
            className="display-block margin-bottom-5"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}
        <p className="text-bold margin-top-4 margin-bottom-0">
          {t('adviceLetter.meetingSummary')}
        </p>
        {adviceLetter.meetingSummary && (
          <RichTextViewer
            className="margin-top-1"
            value={adviceLetter.meetingSummary}
          />
        )}
      </SectionWrapper>

      {/* Recommendations */}
      <SectionWrapper
        borderTop={showSectionBorders}
        className={classNames({
          'margin-top-6 padding-top-1': showSectionBorders,
          'margin-top-5': !showSectionBorders
        })}
      >
        <h2 className="margin-bottom-1">{t('adviceLetter.whatWeRecommend')}</h2>
        {showSectionEditLinks && (
          <UswdsReactLink
            to={`/trb/${trbRequestId}/advice/recommendations`}
            className="display-block margin-bottom-2"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}

        {
          // If no recommendations, return text
          recommendations.length === 0 ? (
            <p className="margin-top-4">{t('adviceLetter.notSpecified')}</p>
          ) : (
            <RecommendationsList
              recommendations={recommendations}
              trbRequestId={trbRequestId}
              className="margin-top-4"
              editable={editable}
              {...recommendationActions}
            />
          )
        }
      </SectionWrapper>

      {/* Next steps */}
      <SectionWrapper
        borderTop={showSectionBorders}
        className={classNames({
          'margin-top-6 padding-top-1': showSectionBorders,
          'margin-top-5': !showSectionBorders
        })}
      >
        <h2 className="margin-bottom-1">{t('adviceLetter.nextSteps')}</h2>
        {showSectionEditLinks && (
          <UswdsReactLink
            to={`/trb/${trbRequestId}/advice/next-steps`}
            className="display-block margin-bottom-5"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}

        <p className="text-bold margin-top-4 margin-bottom-1">
          {t('adviceLetter.nextSteps')}
        </p>
        {adviceLetter.nextSteps ? (
          <RichTextViewer
            className="margin-top-1"
            value={adviceLetter.nextSteps}
          />
        ) : (
          <p className="margin-top-1 line-height-body-5">
            {t('adviceLetter.notSpecified')}
          </p>
        )}

        {/* Follow up */}
        <p className="text-bold margin-top-3 margin-bottom-1">
          {t('adviceLetter.followup')}
        </p>
        <p className="margin-top-1 line-height-body-5">
          {adviceLetter.isFollowupRecommended
            ? t(`Yes, ${adviceLetter.followupPoint}`)
            : t('adviceLetterForm.notNecessary')}
        </p>
      </SectionWrapper>
    </div>
  );
};

export default ReviewAdviceLetter;
