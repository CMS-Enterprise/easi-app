import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';

type SummaryProps = {
  trbRequestId: string;
  name: string;
  requestType: string;
  requester: string;
  submissionDate: string;
};

export default function Summary({
  trbRequestId,
  name,
  requestType,
  requester,
  submissionDate
}: SummaryProps) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <section className="bg-primary-darker padding-bottom-3 text-white">
      <GridContainer>
        {/* Breadcrumbs */}
        <BreadcrumbBar variant="wrap" className="bg-transparent text-white">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span className="text-white">{t('Home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>
            {t('adminHome.breadcrumb', { trbRequestId })}
          </Breadcrumb>
        </BreadcrumbBar>

        {/* Request name */}
        <h2 className="margin-top-05 margin-bottom-0">{name}</h2>

        {/* Request details */}
        <Grid row>
          <Grid col tablet={{ col: 6 }}>
            {/* Request type */}
            <h5 className="text-normal margin-bottom-05 margin-top-2">
              {t('adminHome.requestType')}
            </h5>
            <h4 className="margin-y-05">{t(requestType)}</h4>
          </Grid>
          <Grid col tablet={{ col: 6 }}>
            {/* Requester */}
            <h5 className="text-normal margin-bottom-05 margin-top-2">
              {t('adminHome.requester')}
            </h5>
            <h4 className="margin-y-05">{t(requester)}</h4>
            {/* Submission date */}
            <h5 className="text-normal margin-bottom-05 margin-top-2">
              {t('adminHome.submissionDate')}
            </h5>
            <h4 className="margin-y-05">{t(submissionDate)}</h4>
          </Grid>
        </Grid>
      </GridContainer>
    </section>
  );
}
