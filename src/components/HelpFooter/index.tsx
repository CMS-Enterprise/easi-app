import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GridContainer,
  IconLaunch,
  IconLightbulbOutline
} from '@trussworks/react-uswds';

import IconLink from 'components/shared/IconLink';

// import { SLACK_OIT_DEV_FEEDBACK } from 'constants/externalUrls';

export default () => {
  const { t } = useTranslation('help');
  return (
    <div className="display-flex padding-y-2 bg-primary-dark text-white">
      <GridContainer className="display-flex flex-fill desktop:flex-align-center line-height-body-2">
        <div className="desktop:display-flex flex-fill">
          <div className="width-full desktop:width-auto margin-right-8">
            <h4 className="margin-0 line-height-heading-2">
              {t('footer.wantToHelp')}
            </h4>
          </div>
          <div className="grid-row grid-gap margin-top-2 desktop:margin-top-0">
            <IconLink
              className="font-body-3xs text-white text-no-underline"
              icon={<IconLaunch />}
              iconPosition="after"
              to="/help/report-a-problem"
            >
              {t('footer.reportProblem')}
            </IconLink>

            <IconLink
              className="font-body-3xs text-white text-no-underline"
              icon={<IconLaunch />}
              iconPosition="after"
              to="/help/send-feedback"
            >
              {t('footer.sendFeedback')}
            </IconLink>

            {/* Temp hide slack chat link */}
            {/* <IconLink
              className="font-body-3xs text-white text-no-underline"
              icon={<IconLaunch />}
              iconPosition="after"
              to={SLACK_OIT_DEV_FEEDBACK}
            >
              {t('footer.chatOnSlack')}
            </IconLink> */}
          </div>
        </div>
        <div className="flex-auto">
          <IconLightbulbOutline className="text-primary-light" size={3} />
        </div>
      </GridContainer>
    </div>
  );
};
