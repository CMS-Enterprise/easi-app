import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  GridContainer,
  IconArrowBack,
  IconArrowForward
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import {
  UpdateTrbRequestType,
  UpdateTrbRequestTypeVariables
} from 'queries/types/UpdateTrbRequestType';
import UpdateTrbRequestTypeQuery from 'queries/UpdateTrbRequestTypeQuery';
import { TRBRequestType } from 'types/graphql-global-types';

import Breadcrumbs from './Breadcrumbs';

/**
 * This component sets a `TRBRequestType` for new or existing Requests.
 * The user selects a request type, from `TRBRequestType`,
 * which is set in location state as `requestType` for going through the
 * process of creating a new request, or used to update an existing request.
 */
function RequestType() {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();
  const { pathname } = useLocation();
  const isNew = pathname.startsWith('/trb/start');

  const { id } = useParams<{
    id: string;
  }>();

  const [mutate, { data, error, loading }] = useMutation<
    UpdateTrbRequestType,
    UpdateTrbRequestTypeVariables
  >(UpdateTrbRequestTypeQuery);

  // Return to the task list after updating the type
  useEffect(() => {
    if (data && id) {
      history.push(`/trb/task-list/${id}`);
    }
  }, [data, id, history]);

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          {
            text: t(
              isNew ? 'breadcrumbs.startTrbRequest' : 'steps.changeRequestType'
            )
          }
        ]}
      />

      <PageHeading className="margin-bottom-0">
        {t(isNew ? 'requestType.heading' : 'steps.changeRequestType')}
      </PageHeading>

      <div className="margin-top-1 font-body-lg line-height-body-5 text-light">
        {t('requestType.subhead')}
      </div>

      <UswdsReactLink
        to="/trb"
        className="display-flex flex-align-center margin-top-2"
      >
        <IconArrowBack className="margin-right-1" />
        {t(isNew ? 'requestType.goBack' : 'requestType.goBackWithoutChange')}
      </UswdsReactLink>

      <CardGroup className="flex-align-start margin-top-4 margin-bottom-4">
        {[
          'NEED_HELP',
          'BRAINSTORM'
          // Post-mvp options
          // 'FOLLOWUP', 'FORMAL_REVIEW'
        ].map(requestType => (
          <Card
            key={requestType}
            gridLayout={{ desktop: { col: 6 } }}
            containerProps={{ className: 'shadow-2' }}
          >
            <CardHeader>
              <h3 className="line-height-heading-2">
                {t(`requestType.type.${requestType}.heading`)}
              </h3>
            </CardHeader>
            <CardBody className="padding-bottom-0">
              <div>{t(`requestType.type.${requestType}.text`)}</div>
              <CollapsableLink
                id={requestType}
                label={t(`requestType.whenOption`)}
                className="margin-top-2"
              >
                <div>
                  <ul className="list-style-middot">
                    {t<string[]>(`requestType.type.${requestType}.list`, {
                      returnObjects: true
                    }).map((text: string, idx: number) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={idx}>{text}</li>
                    ))}
                  </ul>
                </div>
              </CollapsableLink>
            </CardBody>
            <CardFooter className="margin-top-3">
              {isNew ? (
                <UswdsReactLink
                  to={{
                    pathname: '/trb/process',
                    state: { requestType }
                  }}
                  className="usa-button"
                  variant="unstyled"
                >
                  {t('button.start')}
                </UswdsReactLink>
              ) : (
                <Button
                  type="button"
                  disabled={!!error || !!loading}
                  onClick={() => {
                    mutate({
                      variables: { id, type: requestType as TRBRequestType }
                    });
                  }}
                >
                  {t('button.continue')}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </CardGroup>
      <div>
        <h3 className="line-height-heading-2">
          {t('requestType.additionalTrbServices')}
        </h3>
        <ul className="list-style-none padding-0">
          <li>
            <UswdsReactLink
              to={{
                pathname: '/trb/process',
                // Reuse a request type until there is one defined for "other"
                state: { requestType: 'NEED_HELP' }
              }}
            >
              {t('requestType.services.other')}
              <IconArrowForward className="margin-left-05 margin-bottom-2px text-tbottom" />
            </UswdsReactLink>
          </li>
        </ul>
      </div>
    </GridContainer>
  );
}

export default RequestType;
