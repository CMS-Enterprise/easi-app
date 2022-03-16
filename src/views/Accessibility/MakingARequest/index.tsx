import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';

const MakingARequest = () => {
  const { t } = useTranslation('accessibility');
  const flags = useFlags();

  return (
    <div
      className="grid-container margin-top-3"
      data-testid="making-a-508-request"
    >
      <div className="tablet:grid-col-10">
        <Alert type="info">
          <Trans i18nKey="accessibility:makingARequest.info">
            indexZero
            <UswdsLink href="mailto:CMS_Section508@cms.hhs.gov">
              email
            </UswdsLink>
            indexTwo
          </Trans>
        </Alert>
        <PageHeading>{t('makingARequest.heading')}</PageHeading>
        <p>{t('makingARequest.useThisService')}</p>
        <ul className="margin-y-3 line-height-body-5">
          <li>
            {t(
              flags.cedar508Requests
                ? 'makingARequest.cedar.request508TestingBullet'
                : 'makingARequest.request508TestingBullet'
            )}
          </li>
          <li>{t('makingARequest.uploadDocumentsBullet')}</li>
        </ul>
        <p className="line-height-body-5">
          <Trans i18nKey="accessibility:makingARequest.email508Team">
            indexZero
            <UswdsLink href="mailto:CMS_Section508@cms.hhs.gov">
              email
            </UswdsLink>
            indexTwo
          </Trans>
        </p>
        {!flags.cedar508Requests && (
          <>
            <h2 className="margin-top-5">
              {t('makingARequest.beforeYouStart')}
            </h2>
            <p>{t('makingARequest.needLcid')}</p>
          </>
        )}
        <p className="margin-y-3">{t('makingARequest.onceYouMakeRequest')}</p>
        <UswdsReactLink
          className="usa-button"
          to="/508/testing-overview?continue=true"
          variant="unstyled"
        >
          {t('makingARequest.continueButton')}
        </UswdsReactLink>
        {!flags.cedar508Requests && (
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
        )}
      </div>
    </div>
  );
};

export default MakingARequest;
