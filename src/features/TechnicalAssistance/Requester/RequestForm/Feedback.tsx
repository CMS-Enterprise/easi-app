import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import { GetTRBRequestQuery } from 'gql/generated/graphql';
import { sortBy } from 'lodash';

import Alert from 'components/Alert';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { TRBFeedbackAction } from 'types/graphql-global-types';

import Breadcrumbs from '../../../../components/Breadcrumbs';
import TrbRequestFeedbackList from '../Feedback';

type FeedbackProps = {
  request: GetTRBRequestQuery['trbRequest'];
  taskListUrl: string;
  prevStep?: string;
};

function Feedback({ request, taskListUrl, prevStep }: FeedbackProps) {
  const { t } = useTranslation('technicalAssistance');

  const { state } = useLocation<{
    fromTaskList: boolean;
  }>();

  const fromTaskList = state?.fromTaskList;

  const returnUrl = fromTaskList
    ? `/trb/task-list/${request.id}`
    : `/trb/requests/${request.id}/${prevStep || 'check'}`;

  const returnToFormLink = useMemo(
    () => (
      <UswdsReactLink to={returnUrl}>
        <Icon.ArrowBack className="margin-right-1 text-middle" />
        <span className="line-height-body-5">
          {fromTaskList
            ? t('requestFeedback.returnToTaskList')
            : t('requestFeedback.returnToForm')}
        </span>
      </UswdsReactLink>
    ),
    [returnUrl, fromTaskList, t]
  );

  const selectedFeedback = fromTaskList
    ? request.feedback.filter(e => !!e.feedbackMessage)
    : request.feedback.filter(
        e => e.action === TRBFeedbackAction.REQUEST_EDITS && !!e.feedbackMessage
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

      {selectedFeedback && selectedFeedback.length > 0 && returnToFormLink}

      {selectedFeedback && selectedFeedback.length === 0 && (
        <Alert slim type="info" className="margin-top-6">
          {t('requestFeedback.noFeedbackAlert')}
        </Alert>
      )}

      {selectedFeedback && selectedFeedback.length > 0 && (
        <>
          <TrbRequestFeedbackList
            feedback={sortBy(selectedFeedback, 'createdAt').reverse()}
          />

          <Divider />
        </>
      )}

      <div className="margin-top-7">{returnToFormLink}</div>
    </GridContainer>
  );
}

export default Feedback;
