import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Grid,
  GridContainer,
  IconArrowBack,
  Link,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import { CMS_TRB_EMAIL } from 'constants/externalUrls';
import GetTrbPublicAdviceLetterQuery from 'queries/GetTrbPublicAdviceLetterQuery';
import {
  GetTrbPublicAdviceLetter,
  GetTrbPublicAdviceLetterVariables
} from 'queries/types/GetTrbPublicAdviceLetter';
import { formatDateLocal } from 'utils/date';
import getPersonNameAndComponentVal from 'utils/getPersonNameAndComponentVal';

import ReviewAdviceLetter from './AdminHome/components/ReviewAdviceLetter';
import Breadcrumbs from './Breadcrumbs';

/**
 * The public view of a TRB Request Advice Letter.
 * This component's url is referred to from the Task List view,
 * as indicated by `fromTaskList`, or email link.
 */
function PublicAdviceLetter() {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
  }>();

  const { state } = useLocation<{ fromTaskList: boolean }>();
  const fromTaskList = state?.fromTaskList;

  const { data } = useQuery<
    GetTrbPublicAdviceLetter,
    GetTrbPublicAdviceLetterVariables
  >(GetTrbPublicAdviceLetterQuery, {
    variables: { id }
  });

  const request = data?.trbRequest;
  const adviceLetter = request?.adviceLetter;

  if (!request || !adviceLetter) return null;

  return (
    <>
      <GridContainer className="full-width">
        <Breadcrumbs
          items={[
            { text: t('breadcrumbs.technicalAssistance'), url: '/trb' },
            { text: t('adviceLetterForm.heading') }
          ]}
        />
        <PageHeading className="margin-top-6 margin-bottom-1">
          {t('adviceLetterForm.heading')}
        </PageHeading>

        {fromTaskList ? (
          <>
            <UswdsReactLink
              className="display-flex flex-align-center"
              to={`/trb/task-list/${id}`}
            >
              <IconArrowBack className="margin-right-05" />
              {t('requestFeedback.returnToTaskList')}
            </UswdsReactLink>
            <p className="line-height-body-5 font-body-lg text-light margin-top-6">
              {t('adviceLetter.thankYou')}
            </p>
          </>
        ) : (
          <p className="line-height-body-5 font-body-lg text-light margin-y-0">
            <Trans
              i18nKey="technicalAssistance:adviceLetter.description"
              components={{
                a: <Link href={`mailto:${CMS_TRB_EMAIL}`}> </Link>,
                email: CMS_TRB_EMAIL
              }}
            />
          </p>
        )}
      </GridContainer>

      {!fromTaskList && (
        <div className="bg-primary-lighter margin-y-6 padding-y-6 trb-advice-letter-request-summary">
          <GridContainer className="full-width">
            <h2 className="margin-top-0 margin-bottom-3">
              {t('adviceLetter.requestSummary')}
            </h2>
            <CollapsableLink
              eyeIcon
              startOpen
              labelPosition="bottom"
              closeLabel={t('adviceLetter.showSummary')}
              styleLeftBar={false}
              id="trb-advice-letter-request-summary"
              label={t('adviceLetter.hideSummary')}
            >
              <dl className="easi-dl">
                <Grid row gap>
                  <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                    <dt>{t('table.header.submissionDate')}</dt>
                    <dd>
                      {request.form.submittedAt
                        ? formatDateLocal(
                            request.form.submittedAt,
                            'MMMM d, yyyy'
                          )
                        : t('check.notYetSubmitted')}
                    </dd>
                  </Grid>
                  <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                    <dt>{t('basic.labels.name')}</dt>
                    <dd>{request.name}</dd>
                  </Grid>
                  <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                    <dt>{t('adminHome.requester')}</dt>
                    <dd>
                      {getPersonNameAndComponentVal(
                        request.requesterInfo.commonName,
                        request.requesterComponent
                      )}
                    </dd>
                  </Grid>
                  <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                    <dt>{t('basic.labels.component')}</dt>
                    <dd>{request.form.component}</dd>
                  </Grid>
                  <Grid col={12}>
                    <dt>{t('basic.labels.needsAssistanceWith')}</dt>
                    <dd>{request.form.needsAssistanceWith}</dd>
                  </Grid>
                </Grid>
              </dl>
            </CollapsableLink>
          </GridContainer>
        </div>
      )}

      <GridContainer className="full-width">
        {adviceLetter && (
          <ReviewAdviceLetter
            adviceLetter={adviceLetter}
            showDateSent={false}
            showSectionBorders={false}
          />
        )}

        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <SummaryBox
              heading={t('adviceLetter.haveQuestions')}
              className="margin-top-6"
            >
              <Trans
                i18nKey="technicalAssistance:adviceLetter.haveQuestionsContact"
                components={{
                  a: <Link href={`mailto:${CMS_TRB_EMAIL}`}> </Link>,
                  email: CMS_TRB_EMAIL
                }}
              />
            </SummaryBox>
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
}

export default PublicAdviceLetter;
