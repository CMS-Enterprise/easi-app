import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  IconLaunch,
  Link as UswdsLink,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import { RequestType } from 'types/graphql-global-types';
import Table from 'views/MyRequests/Table';

const MakingARequest = () => {
  const { t } = useTranslation('accessibility');

  return (
    <div
      className="grid-container margin-top-3"
      data-testid="making-a-508-request"
    >
      <div className="tablet:grid-col-12">
        <Alert type="info">
          <Trans i18nKey="accessibility:makingARequest.info">
            indexZero
            <UswdsLink href="mailto:CMS_Section508@cms.hhs.gov">
              email
            </UswdsLink>
            indexTwo
          </Trans>
        </Alert>
        <PageHeading className="margin-bottom-1">
          {t('makingARequest.heading')}
        </PageHeading>
        <p className="font-body-lg line-height-sans-5 margin-top-0">
          {t('makingARequest.subheading')}
          <UswdsLink
            href="https://www.section508.gov/"
            target="_blank"
            className="display-inline-flex flex-align-center"
          >
            {t('makingARequest.subheadingLink')}
            <IconLaunch className="margin-left-05" />
          </UswdsLink>
          . {/* Period at the end of sentence */}
        </p>
        <SummaryBox
          heading=""
          className="bg-base-lightest border-0 radius-0 padding-2"
        >
          <p className="margin-0 margin-bottom-1">
            {t('makingARequest.useThisService')}
          </p>
          <ul className="padding-left-205 margin-0 line-height-body-5">
            <li>{t('makingARequest.request508TestingBullet')}</li>
            <li>{t('makingARequest.uploadDocumentsBullet')}</li>
          </ul>
        </SummaryBox>

        <p className="line-height-body-5">
          <Trans i18nKey="accessibility:makingARequest.email508Team">
            indexZero
            <UswdsLink href="mailto:CMS_Section508@cms.hhs.gov">
              email
            </UswdsLink>
            indexTwo
          </Trans>
        </p>
        <h3 className="margin-top-5 margin-bottom-2">
          {t('makingARequest.beforeYouStart')}
        </h3>
        <p>{t('makingARequest.needLcid')}</p>
        <UswdsReactLink
          className="usa-button"
          to="/508/testing-overview?continue=true"
          variant="unstyled"
        >
          {t('makingARequest.continueButton')}
        </UswdsReactLink>
        <CollapsableLink
          id="easi-508-no-lcid"
          label={t('makingARequest.noLcidHeader')}
          className="margin-top-3"
        >
          <p className="line-height-body-5">
            <Trans i18nKey="accessibility:makingARequest.noLcidBody">
              indexZero
              <UswdsLink href="mailto:IT_Governance@cms.hhs.gov">
                email
              </UswdsLink>
              indexTwo
            </Trans>
          </p>
        </CollapsableLink>
        <h2 className="padding-top-2 margin-top-5 easi-section__border-top">
          {t('makingARequest.myRequests')}
        </h2>
        <Table
          type={RequestType.ACCESSIBILITY_REQUEST}
          hiddenColumns={['Governance', 'Upcoming meeting date']}
        />
      </div>
    </div>
  );
};

export default MakingARequest;
