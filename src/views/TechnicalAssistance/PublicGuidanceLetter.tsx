import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  Grid,
  GridContainer,
  Icon,
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import { useGetTRBPublicGuidanceLetterQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { PDFExportButton } from 'components/PDFExport';
import Alert from 'components/shared/Alert';
import Breadcrumbs, { BreadcrumbsProps } from 'components/shared/Breadcrumbs';
import CollapsableLink from 'components/shared/CollapsableLink';
import { CMS_TRB_EMAIL } from 'constants/externalUrls';
import { TRBGuidanceLetterStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentVal } from 'utils/getPersonNameAndComponent';
import NotFound from 'views/NotFound';

import ReviewGuidanceLetter from './AdminHome/components/ReviewGuidanceLetter';

/**
 * The public view of a TRB Request Guidance Letter.
 * This component's url is referred to from the Task List view, or email link.
 * Views from the task list are indicated by `fromTaskList`.
 */
function PublicGuidanceLetter() {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
  }>();

  const { state } = useLocation<{ fromTaskList: boolean }>();
  const fromTaskList = state?.fromTaskList;

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: `guidance letter ${id}.pdf`,
    content: () => printRef.current,
    // The lib default is to have no margin, which hides window.prints()'s built in pagination
    // Set auto margins back to show everything the browser renders
    pageStyle: `
      @page {
        margin: auto;
      }
    `
  });

  const { data, error, loading } = useGetTRBPublicGuidanceLetterQuery({
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
    data?.trbRequest.taskStatuses.guidanceLetterStatus !==
    TRBGuidanceLetterStatus.COMPLETED
  ) {
    return (
      <GridContainer className="full-width margin-y-6">
        <Alert type="info" heading={t('guidanceLetter.incomplete')}>
          {t('guidanceLetter.incompleteCheckLater')}
        </Alert>
      </GridContainer>
    );
  }

  const request = data?.trbRequest;
  const guidanceLetter = request?.guidanceLetter;

  if (!request || !guidanceLetter) return null;

  const breadcrumbs: BreadcrumbsProps['items'] = [
    { text: t('breadcrumbs.technicalAssistance'), url: '/trb' }
  ];
  if (fromTaskList) {
    breadcrumbs.push({
      text: t('taskList.heading'),
      url: `/trb/task-list/${id}`
    });
  }
  breadcrumbs.push({ text: t('guidanceLetterForm.heading') });

  return (
    <>
      <GridContainer className="full-width">
        <Breadcrumbs items={breadcrumbs} />

        <PageHeading className="margin-top-6 margin-bottom-1">
          {t('guidanceLetterForm.heading')}
        </PageHeading>

        {fromTaskList ? (
          <>
            <UswdsReactLink to={`/trb/task-list/${id}`}>
              <Icon.ArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
              {t('requestFeedback.returnToTaskList')}
            </UswdsReactLink>

            <p className="line-height-body-5 font-body-lg text-light margin-top-6 margin-bottom-105">
              {t('guidanceLetter.thankYou')}
            </p>
          </>
        ) : (
          <p className="line-height-body-5 font-body-lg text-light margin-top-0 margin-bottom-2">
            <Trans
              i18nKey="technicalAssistance:guidanceLetter.description"
              components={{
                a: <Link href={`mailto:${CMS_TRB_EMAIL}`}> </Link>,
                email: CMS_TRB_EMAIL
              }}
            />
          </p>
        )}

        {!!guidanceLetter && (
          <PDFExportButton handlePrint={handlePrint}>
            {t('guidanceLetter.downloadAsPdf')}
          </PDFExportButton>
        )}
      </GridContainer>

      {!fromTaskList && (
        <div className="bg-primary-lighter margin-y-6 padding-y-6 trb-guidance-letter-request-summary">
          <GridContainer className="full-width">
            <h2 className="margin-top-0 margin-bottom-3">
              {t('guidanceLetter.requestSummary')}
            </h2>
            <CollapsableLink
              eyeIcon
              startOpen
              labelPosition="bottom"
              closeLabel={t('guidanceLetter.hideSummary')}
              styleLeftBar={false}
              id="trb-guidance-letter-request-summary"
              label={t('guidanceLetter.showSummary')}
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
        {guidanceLetter && (
          <div ref={printRef}>
            <h1 className="easi-only-print">
              {t('guidanceLetterForm.heading')}
            </h1>
            <ReviewGuidanceLetter
              trbRequestId={id}
              guidanceLetter={guidanceLetter}
              showDateSent={false}
              showSectionBorders={false}
              editable={false}
              publicView
            />
          </div>
        )}
      </GridContainer>

      <GridContainer className="full-width">
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <SummaryBox className="margin-top-6">
              <SummaryBoxHeading headingLevel="h3">
                {t('guidanceLetter.haveQuestions')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <Trans
                  i18nKey="technicalAssistance:guidanceLetter.haveQuestionsContact"
                  components={{
                    a: <Link href={`mailto:${CMS_TRB_EMAIL}`}> </Link>,
                    email: CMS_TRB_EMAIL
                  }}
                />
              </SummaryBoxContent>
            </SummaryBox>
          </Grid>
        </Grid>

        {fromTaskList && (
          <UswdsReactLink
            className="display-inline-block margin-top-5"
            to={`/trb/task-list/${id}`}
          >
            <Icon.ArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('requestFeedback.returnToTaskList')}
          </UswdsReactLink>
        )}
      </GridContainer>
    </>
  );
}

export default PublicGuidanceLetter;
