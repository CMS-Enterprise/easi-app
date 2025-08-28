import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { Button, GridContainer } from '@trussworks/react-uswds';
import { StepsInProcessContent } from 'features/Help/TechnicalReviewBoard/StepsInProcess';
import {
  TRBRequestType,
  useCreateTRBRequestMutation
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import linkCedarSystemIdQueryString, {
  useLinkCedarSystemIdQueryParam
} from 'utils/linkCedarSystemIdQueryString';

import Breadcrumbs from '../../../../components/Breadcrumbs';

/**
 * Process flow info where the user proceeds to create a new Trb Request.
 */
function ProcessFlow() {
  const { t } = useTranslation('technicalAssistance');
  const { state } = useLocation<{ requestType: TRBRequestType }>();
  const history = useHistory();

  const requestType = state?.requestType;

  const linkCedarSystemId = useLinkCedarSystemIdQueryParam();
  const linkCedarSystemIdQs = linkCedarSystemIdQueryString(linkCedarSystemId);

  const [create, createResult] = useCreateTRBRequestMutation();

  // Redirect to task list on sucessful trb request creation
  useEffect(() => {
    if (createResult.data) {
      history.push(
        `/trb/link/${createResult.data.createTRBRequest.id}?${linkCedarSystemIdQs || ''}`,
        {
          isNew: true
        }
      );
    }
  }, [createResult, history, linkCedarSystemIdQs]);

  // Redirect to start if `requestType` isn't set
  if (!requestType) return <Redirect to="/trb/start" />;

  const requestTypeText = t('requestType.type', {
    returnObjects: true
  }) as Record<string, { heading: string }>;

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
          <UswdsReactLink
            to={{
              pathname: '/trb/start',
              search: linkCedarSystemIdQs
            }}
          >
            {t('steps.changeRequestType')}
          </UswdsReactLink>
        </span>
      </div>

      <StepsInProcessContent />

      <div className="margin-top-1">
        <UswdsReactLink
          to={{
            pathname: '/trb/start',
            search: linkCedarSystemIdQs
          }}
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
