import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, Grid, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetTRBGuidanceLetterQuery,
  TRBGuidanceLetterFragment,
  TRBGuidanceLetterInsightFragment
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import { RichTextViewer } from 'components/RichTextEditor';
import SectionWrapper from 'components/SectionWrapper';
import { formatDateLocal } from 'utils/date';

import InsightsList from '../InsightsList';

type ReviewGuidanceLetterProps = {
  guidanceLetter: TRBGuidanceLetterFragment;
  trbRequestId: string;
  trbRequest?: GetTRBGuidanceLetterQuery['trbRequest'];
  requesterString?: string;
  showSectionEditLinks?: boolean;
  insightActions?: {
    edit?: (insight: TRBGuidanceLetterInsightFragment) => void;
    remove?: (insight: TRBGuidanceLetterInsightFragment) => void;
    setReorderError?: (error: string | null) => void;
  };
  showDateSent?: boolean;
  showSectionBorders?: boolean;
  editable?: boolean;
  publicView?: boolean;
  className?: string;
};

/**
 * Displays guidance letter for review
 */
const ReviewGuidanceLetter = ({
  guidanceLetter,
  trbRequestId,
  trbRequest,
  requesterString,
  showSectionEditLinks = false,
  insightActions,
  showDateSent = true,
  showSectionBorders = true,
  editable = true,
  publicView = false,
  className
}: ReviewGuidanceLetterProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { insights } = guidanceLetter;

  return (
    <div className={className}>
      {/* Thank you text for PDF version */}
      <p className="easi-only-print">{t('guidanceLetter.thankYou')}</p>

      {!publicView && trbRequest && (
        <div className="easi-only-print">
          {/* Project title */}
          <p className="text-bold margin-bottom-0">{t('basic.labels.name')}</p>
          <p className="margin-top-1">{trbRequest.name}</p>

          {/* Request Type */}
          <p className="text-bold margin-bottom-0">
            {t('adminHome.requestType')}
          </p>
          <p className="margin-top-1">
            {t(`requestType.type.${trbRequest.type}.heading`)}
          </p>

          {/* Requester */}
          <p className="text-bold margin-bottom-0">
            {t('adminHome.requester')}
          </p>
          <p className="margin-top-1">{requesterString}</p>

          {/* Submission date */}
          <p className="text-bold margin-bottom-0">
            {t('adminHome.submissionDate')}
          </p>
          <p className="margin-top-1">
            {formatDateLocal(trbRequest.createdAt, 'MMMM d, yyyy')}
          </p>
        </div>
      )}

      {!publicView && (
        <Grid row gap className="margin-bottom-neg-2">
          {/* Date sent */}
          {showDateSent && (
            <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
              <p className="text-bold margin-y-0 easi-no-print">
                {t('guidanceLetter.sendDate')}
              </p>

              <p className="margin-top-1 easi-no-print">
                {guidanceLetter.dateSent
                  ? formatDateLocal(guidanceLetter.dateSent, 'MMMM d, yyyy')
                  : t('guidanceLetter.notYetSent')}
              </p>
            </Grid>
          )}

          {/* Consult session date */}
          {trbRequest && trbRequest.consultMeetingTime && (
            <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
              <p className="text-bold margin-y-0">
                {t('guidanceLetter.consultSessionDate')}
              </p>
              <p className="margin-top-1">
                {t('adminHome.consultDate', {
                  date: formatDateLocal(
                    trbRequest.consultMeetingTime,
                    'MM/dd/yyyy'
                  ),
                  time: DateTime.fromISO(
                    trbRequest.consultMeetingTime
                  ).toLocaleString(DateTime.TIME_SIMPLE)
                })}
              </p>
            </Grid>
          )}
        </Grid>
      )}

      {/* What we heard / meeting summary */}
      <SectionWrapper
        borderTop={showSectionBorders}
        className={classNames({
          'margin-top-6 padding-top-1': showSectionBorders,
          'margin-top-5': !showSectionBorders
        })}
      >
        <h2 className="margin-bottom-1">{t('guidanceLetter.whatWeHeard')}</h2>

        {showSectionEditLinks && (
          <UswdsReactLink
            to={`/trb/${trbRequestId}/guidance/summary`}
            className="display-block margin-bottom-5"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}

        {!publicView && (
          <p className="easi-no-print text-bold margin-top-4 margin-bottom-0">
            {t('guidanceLetter.meetingSummary')}
          </p>
        )}

        {guidanceLetter.meetingSummary && (
          <RichTextViewer
            className="margin-top-1"
            value={guidanceLetter.meetingSummary}
          />
        )}
      </SectionWrapper>

      {/* Insights */}
      <SectionWrapper
        borderTop={showSectionBorders}
        className={classNames({
          'margin-top-6 padding-top-1': showSectionBorders,
          'margin-top-5': !showSectionBorders
        })}
      >
        <h2 className="margin-bottom-1">
          {t('guidanceLetter.guidanceAndInsights')}
        </h2>

        {showSectionEditLinks && (
          <UswdsReactLink
            to={`/trb/${trbRequestId}/guidance/insights`}
            className="display-block margin-bottom-2"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}

        {
          // If no insights, return text
          insights.length === 0 ? (
            <p className="margin-top-4">{t('guidanceLetter.notSpecified')}</p>
          ) : (
            <InsightsList
              trbRequestId={trbRequestId}
              className="margin-top-4"
              editable={editable}
              {...insightActions}
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
        <h2 className="margin-bottom-1">{t('guidanceLetter.nextSteps')}</h2>
        {showSectionEditLinks && (
          <UswdsReactLink
            to={`/trb/${trbRequestId}/guidance/next-steps`}
            className="display-block margin-bottom-5"
          >
            {t('check.edit')}
          </UswdsReactLink>
        )}

        <Alert type="info" slim className="margin-bottom-4" headingLevel="h1">
          <Trans
            i18nKey="technicalAssistance:guidanceLetter.nextStepsDescription"
            components={{
              a: <Link href="mailto:cms-trb@cms.hhs.gov"> </Link>
            }}
          />
        </Alert>

        <p className="text-bold margin-top-4 margin-bottom-1">
          {t('guidanceLetter.nextSteps')}
        </p>

        {guidanceLetter.nextSteps ? (
          <RichTextViewer
            className="margin-top-1"
            value={guidanceLetter.nextSteps}
          />
        ) : (
          <p className="margin-top-1 line-height-body-5">
            {t('guidanceLetter.notSpecified')}
          </p>
        )}

        {/* Follow up */}
        <p className="text-bold margin-top-3 margin-bottom-1">
          {t('guidanceLetter.followup')}
        </p>

        <p className="margin-top-1 line-height-body-5">
          {guidanceLetter.isFollowupRecommended
            ? t(`Yes, ${guidanceLetter.followupPoint}`)
            : t('guidanceLetterForm.notNecessary')}
        </p>
      </SectionWrapper>
    </div>
  );
};

export default ReviewGuidanceLetter;
