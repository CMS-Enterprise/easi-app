import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Alert, Grid, Link } from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import PDFExport from 'components/PDFExport';
import SectionWrapper from 'components/shared/SectionWrapper';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';

import AdminAction from './components/AdminAction';
import AdminTaskStatusTag from './components/AdminTaskStatusTag';
import RequestNotes from './components/RequestNotes';

import './AdviceLetter.scss';

const AdviceLetter = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  // TRB request query
  const { data, loading } = useQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: { id: trbRequestId }
  });

  const { adviceLetter, taskStatuses } = data?.trbRequest || {};

  /**
   * Advice letter status
   *
   * Defaults to `CANNOT_START_YET` to fix issue where query returns undefined if no advice letter is present
   */
  const adviceLetterStatus =
    taskStatuses?.adviceLetterStatus || TRBAdviceLetterStatus.CANNOT_START_YET;

  const author = adviceLetter?.author;
  const recommendations = adviceLetter?.recommendations || [];

  // Page loading
  if (loading) return <PageLoading />;

  return (
    <div
      className="trb-admin-home__advice"
      data-testid="trb-admin-home__advice"
      id={`trbAdminAdviceLetter-${trbRequestId}`}
    >
      <Grid row gap="lg">
        <Grid tablet={{ col: 8 }}>
          <h1 className="margin-top-0 margin-bottom-05">
            {t('adminHome.subnav.adviceLetter')}
          </h1>
          <p className="margin-y-0 line-height-body-5 font-body-md">
            {t('adviceLetter.introText')}
          </p>

          {/* Status tag */}
          <AdminTaskStatusTag
            status={adviceLetterStatus}
            name={author?.commonName!}
            date={adviceLetter?.modifiedAt || adviceLetter?.createdAt || ''}
            className="margin-bottom-205"
          />
        </Grid>
        <Grid tablet={{ col: 4 }}>
          <RequestNotes trbRequestId={trbRequestId} />
        </Grid>
      </Grid>

      {
        // If no advice letter, show alert message
        !adviceLetter ? (
          <Alert type="info" slim>
            {t('adviceLetter.noAdviceLetter')}
          </Alert>
        ) : (
          /* Advice letter content */
          <PDFExport
            title={t('adminHome.subnav.adviceLetter')}
            filename={`Advice letter for ${data?.trbRequest?.name}`}
            label={t('adviceLetter.downloadAsPdf')}
            linkPosition="top"
          >
            <AdminAction className="margin-top-3 margin-bottom-5" />

            {/* Date sent */}
            <p className="text-bold margin-bottom-0">
              {t('adviceLetter.sendDate')}
            </p>
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
                        className="bg-base-lightest padding-x-4 padding-y-1 padding-bottom-4"
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
                            const formattedLink = link.replace(
                              /^https?:\/\//i,
                              ''
                            );
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
          </PDFExport>
        )
      }
    </div>
  );
};

export default AdviceLetter;
