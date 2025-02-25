import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpPageIntro from 'components/HelpPageIntro';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import RelatedArticles from 'components/RelatedArticles';
import { CMS_TRB_EMAIL } from 'constants/externalUrls';

import NeedHelpBox from '../../NeedHelpBox';

const StepsInProcess = () => {
  const { t } = useTranslation('stepsInTRBProcess');
  return (
    <>
      <MainContent className="grid-container margin-bottom-7">
        <HelpBreadcrumb type="close" />
        <HelpPageIntro
          type="Technical Review Board"
          heading={t('title')}
          subheading={t('description')}
        />

        <StepsInProcessContent hideDescription />

        <NeedHelpBox
          className="desktop:grid-col-6 margin-top-6"
          content={t('help.text')}
          email={CMS_TRB_EMAIL}
        />
      </MainContent>

      <RelatedArticles articles={['prepareTrbConsultMeeting']} />
    </>
  );
};

export const StepsInProcessContent = ({
  hideDescription
}: {
  hideDescription?: boolean;
}) => {
  const { t } = useTranslation('stepsInTRBProcess');

  const infoText = t<Record<string, string[]>>('info', {
    returnObjects: true
  });
  const stepsText = t<Record<string, string | string[]>[]>('list', {
    returnObjects: true
  });

  return (
    <>
      {!hideDescription && (
        <div className="margin-top-2 font-body-lg line-height-body-5 text-light">
          {t('description')}
        </div>
      )}
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
          {t('stepsInTheProcess')}
        </h2>
        <ProcessList className="padding-top-0 grid-col-8">
          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {stepsText[0].heading}
            </ProcessListHeading>
            <p>{stepsText[0].text[0]}</p>
            <p>{stepsText[0].text[1]}</p>
          </ProcessListItem>
          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {stepsText[1].heading}
            </ProcessListHeading>
            <p>{stepsText[1].text[0]}</p>
          </ProcessListItem>
          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {stepsText[2].heading}
            </ProcessListHeading>
            <p className="margin-bottom-0">{stepsText[2].text[0]}</p>
            <ul className="list-style-middot">
              <li>{stepsText[2].list[0]}</li>
              <li>{stepsText[2].list[1]}</li>
              <li>{stepsText[2].list[2]}</li>
            </ul>
            <p>
              <UswdsReactLink
                to="/help/trb/prepare-consult-meeting"
                target="_blank"
              >
                {stepsText[2].text[1]}
              </UswdsReactLink>
            </p>
          </ProcessListItem>
          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {stepsText[3].heading}
            </ProcessListHeading>
            <p className="margin-bottom-0">{stepsText[3].text[0]}</p>
            <ul className="list-style-middot">
              <li>{stepsText[3].list[0]}</li>
              <li>{stepsText[3].list[1]}</li>
              <li>{stepsText[3].list[2]}</li>
            </ul>
            <p>{stepsText[3].text[1]}</p>
          </ProcessListItem>
          <ProcessListItem className="maxw-none">
            <ProcessListHeading type="h3">
              {stepsText[4].heading}
            </ProcessListHeading>
            <p>{stepsText[4].text[0]}</p>
          </ProcessListItem>
        </ProcessList>
      </div>
    </>
  );
};

export default StepsInProcess;
