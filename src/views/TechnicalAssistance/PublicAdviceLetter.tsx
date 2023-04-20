import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, GridContainer, Link, SummaryBox } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import { CMS_TRB_EMAIL } from 'constants/externalUrls';
import GetTrbPublicAdviceLetterQuery from 'queries/GetTrbPublicAdviceLetterQuery';
import {
  GetTrbPublicAdviceLetter,
  GetTrbPublicAdviceLetterVariables
} from 'queries/types/GetTrbPublicAdviceLetter';
import { formatDateLocal } from 'utils/date';

import ReviewAdviceLetter from './AdminHome/components/ReviewAdviceLetter';
import Breadcrumbs from './Breadcrumbs';
import { getPersonVal } from './TrbAdminTeamHome';

function PublicAdviceLetter() {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
  }>();

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
        <PageHeading>{t('adviceLetterForm.heading')}</PageHeading>
        <p className="line-height-body-5 font-body-lg text-light margin-y-1">
          <Trans
            i18nKey="technicalAssistance:adviceLetter.description"
            components={{
              a: <Link href={`mailto:${CMS_TRB_EMAIL}`}> </Link>,
              email: CMS_TRB_EMAIL
            }}
          />
        </p>
      </GridContainer>

      <div className="bg-primary-lighter">
        <GridContainer className="full-width">
          <h2>{t('adviceLetter.requestSummary')}</h2>
          <CollapsableLink
            className="margin-top-3"
            eyeIcon
            startOpen
            labelPosition="bottom"
            closeLabel={t('Hide summary')}
            styleLeftBar={false}
            id={t('singleSystem.id')}
            label={t('Show summary')}
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
                    {getPersonVal(
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
            <SummaryBox heading={t('adviceLetter.haveQuestions')}>
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
