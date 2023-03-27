import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { GridContainer, IconArrowBack } from '@trussworks/react-uswds';
import { sortBy } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { GetTrbRequest_trbRequest as TrbRequest } from 'queries/types/GetTrbRequest';
import { TRBFeedbackAction } from 'types/graphql-global-types';

import Breadcrumbs from '../Breadcrumbs';
import TrbRequestFeedbackList from '../TrbRequestFeedbackList';

type FeedbackProps = {
  request: TrbRequest;
  taskListUrl: string;
};

function Feedback({ request, taskListUrl }: FeedbackProps) {
  const { t } = useTranslation('technicalAssistance');

  const { state } = useLocation<{
    fromTaskList: boolean;
  }>();

  const fromTaskList = state?.fromTaskList;

  const returnUrl = fromTaskList
    ? `/trb/task-list/${request.id}`
    : `/trb/requests/${request.id}/check`;

  const returnToFormLink = useMemo(
    () => (
      <UswdsReactLink to={returnUrl}>
        <IconArrowBack className="margin-right-1 text-middle" />
        <span className="line-height-body-5">
          {fromTaskList
            ? t('requestFeedback.returnToTaskList')
            : t('requestFeedback.returnToForm')}
        </span>
      </UswdsReactLink>
    ),
    [returnUrl, fromTaskList, t]
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
          ...(fromTaskList
            ? []
            : [
                {
                  text: t('requestForm.heading'),
                  url: returnUrl
                }
              ]),

          { text: t('requestFeedback.viewFeedback') }
        ]}
      />

      <PageHeading className="margin-top-6- margin-bottom-1">
        {t('requestFeedback.heading')}
      </PageHeading>
      {returnToFormLink}

      <TrbRequestFeedbackList
        feedback={sortBy(
          request.feedback.filter(
            e => e.action === TRBFeedbackAction.REQUEST_EDITS
          ),
          'createdAt'
        ).reverse()}
      />

      <div className="margin-top-7">{returnToFormLink}</div>
    </GridContainer>
  );
}

export default Feedback;
