import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import SectionWrapper from 'components/shared/SectionWrapper';
import { GetTrbAdviceLetter_trbRequest_adviceLetter as AdviceLetter } from 'queries/types/GetTrbAdviceLetter';
import { formatDateLocal } from 'utils/date';

import RecommendationsList from './RecommendationsList';

type ReviewAdviceLetterProps = {
  adviceLetter: AdviceLetter;
  showEditLinks?: boolean;
  showDateSent?: boolean;
  showSectionBorders?: boolean;
  className?: string;
};

/**
 * Displays advice letter for review
 */
const ReviewAdviceLetter = ({
  adviceLetter,
  showEditLinks = false,
  showDateSent = true,
  showSectionBorders = true,
  className
}: ReviewAdviceLetterProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const { recommendations } = adviceLetter;

  const { id } = useParams<{ id: string }>();

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
        {showEditLinks && (
          <UswdsReactLink
            to={`/trb/${id}/advice/summary`}
            className="display-block margin-bottom-5"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}
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
        className={classNames({
          'margin-top-6 padding-top-1': showSectionBorders,
          'margin-top-5': !showSectionBorders
        })}
      >
        <h2 className="margin-bottom-1">{t('adviceLetter.whatWeRecommend')}</h2>
        {showEditLinks && (
          <UswdsReactLink
            to={`/trb/${id}/advice/recommendations`}
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
              type="form"
              recommendations={recommendations}
              edit={
                showEditLinks
                  ? {
                      onClick: recommendation =>
                        history.push(`/trb/${id}/advice/recommendations/form`, {
                          recommendation: {
                            ...recommendation,
                            links: recommendation.links.map(link => ({ link }))
                          }
                        })
                    }
                  : undefined
              }
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
        {showEditLinks && (
          <UswdsReactLink
            to={`/trb/${id}/advice/next-steps`}
            className="display-block margin-bottom-5"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}

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
