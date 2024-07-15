import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, IconArrowBack } from '@trussworks/react-uswds';

import IconLink from 'components/shared/IconLink';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';

import { ReviewerKey } from '../subNavItems';

const GRBReviewerForm = () => {
  const { t } = useTranslation('grbReview');

  const { reviewerType, systemId } = useParams<{
    reviewerType: ReviewerKey;
    systemId: string;
  }>();

  return (
    <Grid className="tablet:grid-col-8 padding-y-4">
      <h1 className="margin-bottom-1">{t('form.title')}</h1>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105">
        {t('form.description')}
      </p>
      <p className="margin-top-1 text-base">
        <Trans
          i18nKey="action:fieldsMarkedRequired"
          components={{ asterisk: <RequiredAsterisk /> }}
        />
      </p>

      <IconLink
        icon={<IconArrowBack />}
        to={`/${reviewerType}/${systemId}/governance-review`}
        className="margin-top-3"
      >
        {t('form.returnToRequest')}
      </IconLink>
    </Grid>
  );
};

export default GRBReviewerForm;
