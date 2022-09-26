import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

function Steps() {
  const { state } = useLocation<{ requestType: string }>();
  const requestType = state?.requestType;

  const { t } = useTranslation('technicalAssistance');
  const infoText = t<Record<string, string[]>>('steps.info', {
    returnObjects: true
  });
  const stepsText = t<Record<string, string | string[]>[]>('steps.list', {
    returnObjects: true
  });

  return (
    <div>
      <PageHeading className="margin-bottom-0">
        {t('steps.heading')}
      </PageHeading>
      <div>
        <span className="line-height-body-5 text-base margin-right-2">
          {t('steps.problemWithSystem')}
        </span>
        <span>
          <UswdsReactLink to="/trb/start">
            {t('steps.changeRequestType')}
          </UswdsReactLink>
        </span>
      </div>
      <div className="margin-top-2 font-body-lg line-height-body-5 text-light">
        {t('steps.description')}
      </div>
      <div className="margin-top-4 padding-2 line-height-body-5 bg-gray-5">
        <div>{infoText.text[0]}</div>
        <ul className="margin-y-1 list-style-middot-inner">
          <li>{infoText.list[0]}</li>
          <li>{infoText.list[1]}</li>
          <li>{infoText.list[2]}</li>
        </ul>
        <div>{infoText.text[1]}</div>
      </div>
      <div>
        <h2 className="margin-top-6 margin-bottom-5">
          {t('steps.stepsInTheProcess')}
        </h2>
        <ProcessList className="padding-top-0">
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {stepsText[0].heading}
            </ProcessListHeading>
            <p>{stepsText[0].text[0]}</p>
            <p>{stepsText[0].text[1]}</p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {stepsText[1].heading}
            </ProcessListHeading>
            <p>{stepsText[1].text[0]}</p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {stepsText[2].heading}
            </ProcessListHeading>
            <p className="margin-bottom-0">{stepsText[2].text[0]}</p>
            <ul className="list-style-middot">
              <li>{stepsText[2].list[0]}</li>
              <li>{stepsText[2].list[1]}</li>
              <li>{stepsText[2].list[2]}</li>
            </ul>
            <p>{stepsText[2].text[1]}</p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {stepsText[3].heading}
            </ProcessListHeading>
            <p className="margin-bottom-0">{stepsText[3].text[0]}</p>
            <ul className="list-style-middot">
              <li>{stepsText[3].list[0]}</li>
              <li>{stepsText[3].list[1]}</li>
              <li>{stepsText[3].list[2]}</li>
            </ul>
            <p>{stepsText[3].text[2]}</p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type="h3">
              {stepsText[4].heading}
            </ProcessListHeading>
            <p>{stepsText[4].text[0]}</p>
          </ProcessListItem>
        </ProcessList>
      </div>
      <div className="margin-top-1">
        <UswdsReactLink
          to="/trb/start"
          className="usa-button usa-button--outline margin-bottom-1 tablet:margin-bottom-0"
          variant="unstyled"
        >
          {t('steps.back')}
        </UswdsReactLink>
        <UswdsReactLink
          to={{
            pathname: '/trb/new',
            state: { requestType }
          }}
          className="usa-button"
          variant="unstyled"
        >
          {t('steps.continue')}
        </UswdsReactLink>
      </div>
    </div>
  );
}

export default Steps;
