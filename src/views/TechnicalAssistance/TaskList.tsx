import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GridContainer } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import GetTrbTasklistQuery from 'queries/GetTrbTasklistQuery';
import {
  GetTrbTasklist,
  GetTrbTasklistVariables
} from 'queries/types/GetTrbTasklist';
import NotFoundPartial from 'views/NotFound/NotFoundPartial';

import Breadcrumbs from './Breadcrumbs';

function TaskList() {
  const { t } = useTranslation('technicalAssistance');
  const requestTypeText = t<Record<string, { heading: string }>>(
    'newRequest.type',
    {
      returnObjects: true
    }
  );

  const { id } = useParams<{
    id: string;
  }>();

  const { data, error, loading } = useQuery<
    GetTrbTasklist,
    GetTrbTasklistVariables
  >(GetTrbTasklistQuery, {
    variables: {
      id
    }
  });

  if (error) {
    return (
      <GridContainer className="width-full">
        <NotFoundPartial />
      </GridContainer>
    );
  }

  const formStatus = data?.trbRequest.form.status;

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          {
            text: t('taskList.heading')
          }
        ]}
      />
      <PageHeading className="margin-bottom-0">
        {t('taskList.heading')}
      </PageHeading>

      {data ? (
        <div>
          {data && (
            <div>
              {requestTypeText[data.trbRequest.type].heading}

              <UswdsReactLink to={`/trb/type/${id}`}>
                {t('steps.changeRequestType')}
              </UswdsReactLink>
            </div>
          )}

          {/* ready to start | in progress */}
          <div>{formStatus}</div>

          <div className="trb-initial-request-form">
            <UswdsReactLink
              variant="unstyled"
              className="usa-button"
              to={`/trb/requests/${id}`}
            >
              {t(
                formStatus === 'READY_TO_START'
                  ? 'button.start'
                  : 'button.continue'
              )}
            </UswdsReactLink>
          </div>
        </div>
      ) : (
        loading && <PageLoading />
      )}
    </GridContainer>
  );
}

export default TaskList;
