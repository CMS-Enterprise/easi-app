import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer, IconArrowBack } from '@trussworks/react-uswds';
import { sortBy } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
import { GetTrbRequest_trbRequest as TrbRequest } from 'queries/types/GetTrbRequest';
import { formatDateLocal } from 'utils/date';

import Breadcrumbs from '../Breadcrumbs';

type FeedbackProps = {
  request: TrbRequest;
  taskListUrl: string;
};

function Feedback({ request, taskListUrl }: FeedbackProps) {
  const { t } = useTranslation('technicalAssistance');

  const returnUrl = `/trb/requests/${request.id}/check`;

  const returnToFormLink = useMemo(
    () => (
      <UswdsReactLink to={returnUrl}>
        <IconArrowBack className="margin-right-1 text-middle" />
        <span className="line-height-body-5">
          {t('requestFeedback.returnToForm')}
        </span>
      </UswdsReactLink>
    ),
    [returnUrl, t]
  );

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          {
            text: t('taskList.heading'),
            url: taskListUrl
          },
          {
            text: t('requestForm.heading'),
            url: returnUrl
          },
          { text: t('requestFeedback.viewFeedback') }
        ]}
      />

      <PageHeading className="margin-top-6- margin-bottom-1">
        {t('requestFeedback.heading')}
      </PageHeading>
      {returnToFormLink}

      {sortBy(request.feedback, 'createdAt')
        .reverse()
        .map(item => {
          return (
            <React.Fragment key={item.id}>
              <Grid row gap className="margin-top-4 margin-bottom-6">
                <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                  <dl className="easi-dl">
                    <dt>{t('requestFeedback.date')}</dt>
                    <dd>{formatDateLocal(item.createdAt, 'MMMM d, yyyy')}</dd>
                  </dl>
                </Grid>
                <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                  <dl className="easi-dl">
                    <dt>{t('requestFeedback.from')}</dt>
                    <dd>{item.createdBy}</dd>
                  </dl>
                </Grid>
                <Grid col={12}>
                  <div className="padding-3 bg-base-lightest line-height-body-5">
                    {item.feedbackMessage}
                  </div>
                </Grid>
              </Grid>
              <Divider />
            </React.Fragment>
          );
        })}

      <div className="margin-top-7">{returnToFormLink}</div>
    </GridContainer>
  );
}

export default Feedback;
