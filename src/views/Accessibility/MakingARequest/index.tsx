import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as USWDSLink } from '@trussworks/react-uswds';

import BreadcrumbNav from 'components/BreadcrumbNav';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';

const MakingARequest = () => {
  const { t } = useTranslation('accessibility');

  return (
    <div className="grid-container margin-y-2">
      <BreadcrumbNav className="margin-bottom-2">
        <li>
          <Link to="/">Home</Link>
          <i className="fa fa-angle-right margin-x-05" aria-hidden />
        </li>
        <li>{t('makingARequest.breadcrumb')}</li>
      </BreadcrumbNav>
      <div className="tablet:grid-col-10">
        <Alert type="info">{t('makingARequest.info')}</Alert>
        <PageHeading>{t('makingARequest.heading')}</PageHeading>
        <p>{t('makingARequest.useThisService')}</p>
        <ul className="margin-top-3">
          <li className="margin-bottom-3">
            {t('makingARequest.request508TestingBullet')}
          </li>
          <li className="margin-bottom-3">
            {t('makingARequest.uploadDocumentNamespace')}
          </li>
        </ul>
        <p className="line-height-body-5">{t('makingARequest.email508Team')}</p>
        <h2>{t('makingARequest.beforeYouStart')}</h2>
        <p>{t('makingARequest.needLcid')}</p>
        <p>{t('makingARequest.onceYouMakeRequest')}</p>
        <USWDSLink
          className="usa-button margin-bottom-3"
          to="/508/testing-overview?continue=true"
          asCustom={Link}
          variant="unstyled"
        >
          {t('makingARequest.continueButton')}
        </USWDSLink>
        <CollapsableLink
          id="easi-508-no-lcid"
          label={t('makingARequest.noLcidHeader')}
        >
          <p className="line-height-body-5">{t('makingARequest.noLcidBody')}</p>
        </CollapsableLink>
      </div>
    </div>
  );
};

export default MakingARequest;
