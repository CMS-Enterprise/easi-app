import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import SectionWrapper from 'components/shared/SectionWrapper';
import { GetTrbAdviceLetter_trbRequest_adviceLetter as AdviceLetter } from 'queries/types/GetTrbAdviceLetter';
import { formatDateLocal } from 'utils/date';

/**
 * Displays advice letter for review
 */
const ReviewAdviceLetter = ({
  adviceLetter
}: {
  adviceLetter: AdviceLetter;
}) => {
  const { t } = useTranslation('technicalAssistance');

  const { recommendations } = adviceLetter;

  return (
    <div>
      {/* Date sent */}
      <p className="text-bold margin-bottom-0">{t('adviceLetter.sendDate')}</p>
      <p className="margin-top-1">
        {adviceLetter.dateSent
          ? formatDateLocal(adviceLetter.dateSent, 'MMMM d, yyyy')
          : t('adviceLetter.notYetSent')}
      </p>

      {/* What we heard / meeting summary */}
      <SectionWrapper borderTop className="margin-top-6 padding-top-1">
        <h2>{t('adviceLetter.whatWeHeard')}</h2>
        <p className="text-bold margin-top-4 margin-bottom-0">
          {t('adviceLetter.meetingSummary')}
        </p>
        <p className="margin-top-1 line-height-body-5">
          {adviceLetter.meetingSummary}
        </p>
      </SectionWrapper>

      {/* Recommendations */}
      <SectionWrapper borderTop className="margin-top-6 padding-top-1">
        <h2>{t('adviceLetter.whatWeRecommend')}</h2>
        {
          // If no recommendations, return text
          recommendations.length === 0 ? (
            <p>{t('adviceLetter.notSpecified')}</p>
          ) : (
            // Display recommendations
            recommendations.map(({ title, recommendation, links }) => {
              return (
                <div
                  key={title}
                  className="bg-base-lightest padding-x-4 padding-y-1 padding-bottom-4 margin-bottom-3"
                >
                  <h3 className="margin-bottom-1">{title}</h3>
                  <p className="margin-top-0 line-height-body-5">
                    {recommendation}
                  </p>
                  <p className="text-bold margin-bottom-1 margin-top-3">
                    {t('adviceLetter.resources')}
                  </p>

                  <ul className="usa-list usa-list--unstyled">
                    {links.map((link, index) => {
                      /** Removes http:// or https:// from link string to standardize links */
                      // TODO: handle formatting when creating recommendation so that links are standardized and we only have to do this in one place
                      const formattedLink = link.replace(/^https?:\/\//i, '');
                      return (
                        <li
                          key={`link-${index}`} // eslint-disable-line react/no-array-index-key
                        >
                          <Link
                            aria-label={`Open ${formattedLink} in a new tab`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="external"
                            href={`http://${formattedLink}`}
                            className="display-block margin-top-1"
                          >
                            {formattedLink}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )
        }
      </SectionWrapper>

      {/* Next steps */}
      <SectionWrapper borderTop className="margin-top-6 padding-top-1">
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
