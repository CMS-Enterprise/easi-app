import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  IconArrowBack,
  IconArrowForward
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

function StartRequest() {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div>
      <PageHeading className="margin-bottom-0">
        {t('newRequest.heading')}
      </PageHeading>
      <div className="margin-top-1 font-body-lg line-height-body-5 text-light">
        {t('newRequest.subhead')}
      </div>
      <div className="margin-top-2">
        <UswdsReactLink to="/trb">
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('newRequest.goBack')}
        </UswdsReactLink>
      </div>
      <CardGroup className="margin-top-4 margin-bottom-4">
        {['NEED_HELP', 'BRAINSTORM', 'FOLLOWUP', 'FORMAL_REVIEW'].map(
          requestType => {
            return (
              <Card
                key={requestType}
                gridLayout={{ desktop: { col: 6 } }}
                containerProps={{ className: 'shadow-2' }}
              >
                <CardHeader>
                  <h3 className="line-height-heading-2">
                    {t(`newRequest.type.${requestType}.heading`)}
                  </h3>
                </CardHeader>
                <CardBody>
                  <div>{t(`newRequest.type.${requestType}.text`)}</div>
                  <div>
                    <ul className="list-style-middot">
                      {t<string[]>(`newRequest.type.${requestType}.list`, {
                        returnObjects: true
                      }).map((text: string, idx: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={idx}>{text}</li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
                <CardFooter>
                  <UswdsReactLink
                    to={{
                      pathname: '/trb/steps',
                      state: { requestType }
                    }}
                    className="usa-button"
                    variant="unstyled"
                  >
                    {t('newRequest.start')}
                  </UswdsReactLink>
                </CardFooter>
              </Card>
            );
          }
        )}
      </CardGroup>
      <div>
        <h3 className="line-height-heading-2">
          {t('newRequest.additionalTrbServices')}
        </h3>
        <ul className="list-style-none padding-0">
          <li>
            <UswdsReactLink
              to={{
                pathname: '/trb/steps',
                state: { requestType: 'Other' }
              }}
            >
              {t('newRequest.services.other')}
              <IconArrowForward className="margin-left-05 margin-bottom-2px text-tbottom" />
            </UswdsReactLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default StartRequest;
