import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, GridContainer } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import CreateTrbRequestQuery from 'queries/CreateTrbRequestQuery';
import {
  CreateTrbRequest,
  CreateTrbRequestVariables
} from 'queries/types/CreateTrbRequest';
import { TRBRequestType } from 'types/graphql-global-types';
import { StepsInProcessContent } from 'views/Help/TechnicalReviewBoard/StepsInProcess';

import Breadcrumbs from './Breadcrumbs';

/**
 * Process flow info where the user proceeds to create a new Trb Request.
 */
function ProcessFlow() {
  const { t } = useTranslation('technicalAssistance');
  const { state } = useLocation<{ requestType: TRBRequestType }>();
  const history = useHistory();
  const flags = useFlags();

  const requestType = state?.requestType;

  const [create, createResult] = useMutation<
    CreateTrbRequest,
    CreateTrbRequestVariables
  >(CreateTrbRequestQuery);

  // Redirect to task list on sucessful trb request creation
  useEffect(() => {
    if (createResult.data) {
      history.push(
        flags.trbLinkRequestsRequester
          ? `/trb/link/${createResult.data.createTRBRequest.id}`
          : `/trb/task-list/${createResult.data.createTRBRequest.id}`,
        {
          isNew: true
        }
      );
    }
  }, [createResult, history, flags.trbLinkRequestsRequester]);

  // Redirect to start if `requestType` isn't set
  if (!requestType) return <Redirect to="/trb/start" />;

  const requestTypeText = t<Record<string, { heading: string }>>(
    'requestType.type',
    {
      returnObjects: true
    }
  );

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          { text: t('breadcrumbs.startTrbRequest') }
        ]}
      />
      <PageHeading className="margin-bottom-0">
        {t('steps.heading')}
      </PageHeading>
      <div>
        <span className="font-body-md line-height-body-4 text-base margin-right-2">
          {requestTypeText[requestType].heading}
        </span>
        <span>
          <UswdsReactLink to="/trb/start">
            {t('steps.changeRequestType')}
          </UswdsReactLink>
        </span>
      </div>

      <StepsInProcessContent />

      <div className="margin-top-1">
        <UswdsReactLink
          to="/trb/start"
          className="usa-button usa-button--outline margin-bottom-1 tablet:margin-bottom-0"
          variant="unstyled"
        >
          {t('steps.back')}
        </UswdsReactLink>
        <Button
          type="button"
          disabled={createResult.loading}
          onClick={() => {
            create({ variables: { requestType } });
          }}
        >
          {t('steps.continue')}
        </Button>
      </div>
    </GridContainer>
  );
}

export default ProcessFlow;
