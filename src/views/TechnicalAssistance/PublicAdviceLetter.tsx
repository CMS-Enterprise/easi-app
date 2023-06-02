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
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import { CMS_TRB_EMAIL } from 'constants/externalUrls';
import GetTrbPublicAdviceLetterQuery from 'queries/GetTrbPublicAdviceLetterQuery';
import {
  GetTrbPublicAdviceLetter,
  GetTrbPublicAdviceLetterVariables
} from 'queries/types/GetTrbPublicAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import getPersonNameAndComponentVal from 'utils/getPersonNameAndComponentVal';
import NotFound from 'views/NotFound';

import ReviewAdviceLetter from './AdminHome/components/ReviewAdviceLetter';
import Breadcrumbs, { BreadcrumbsProps } from './Breadcrumbs';

/**
 * The public view of a TRB Request Advice Letter.
 * This component's url is referred to from the Task List view, or email link.
 * Views from the task list are indicated by `fromTaskList`.
 */
function PublicAdviceLetter() {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
  }>();

  const { state } = useLocation<{ fromTaskList: boolean }>();
  const fromTaskList = state?.fromTaskList;

  const { data, error, loading } = useQuery<
    GetTrbPublicAdviceLetter,
    GetTrbPublicAdviceLetterVariables
  >(GetTrbPublicAdviceLetterQuery, {
    variables: { id }
  });

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFound />;
  }

  // Alert if the letter is incomplete
  if (
    data?.trbRequest.taskStatuses.adviceLetterStatus !==
    TRBAdviceLetterStatus.COMPLETED
  ) {
    return (
      <GridContainer className="full-width margin-y-6">
        <Alert type="info" heading={t('adviceLetter.incomplete')}>
          {t('adviceLetter.incompleteCheckLater')}
        </Alert>
      </GridContainer>
    );
  }

  const request = data?.trbRequest;
  const adviceLetter = request?.adviceLetter;

  if (!request || !adviceLetter) return null;

  const breadcrumbs: BreadcrumbsProps['items'] = [
    { text: t('breadcrumbs.technicalAssistance'), url: '/trb' }
  ];
  if (fromTaskList) {
    breadcrumbs.push({
      text: t('taskList.heading'),
      url: `/trb/task-list/${id}`
    });
  }
  breadcrumbs.push({ text: t('adviceLetterForm.heading') });

  return (
    <>
      <GridContainer className="full-width">
        <Breadcrumbs items={breadcrumbs} />
        <PageHeading className="margin-top-6 margin-bottom-1">
          {t('adviceLetterForm.heading')}
        </PageHeading>

        {fromTaskList ? (
          <>
            <UswdsReactLink to={`/trb/task-list/${id}`}>
              <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
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
              closeLabel={t('adviceLetter.hideSummary')}
              styleLeftBar={false}
              id="trb-advice-letter-request-summary"
              label={t('adviceLetter.showSummary')}
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
            trbRequestId={id}
            adviceLetter={adviceLetter}
            showDateSent={false}
            showSectionBorders={false}
            publicForm
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

        {fromTaskList && (
          <UswdsReactLink
            className="display-inline-block margin-top-5"
            to={`/trb/task-list/${id}`}
          >
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('requestFeedback.returnToTaskList')}
          </UswdsReactLink>
        )}
      </GridContainer>
    </>
  );
}

export default PublicAdviceLetter;
