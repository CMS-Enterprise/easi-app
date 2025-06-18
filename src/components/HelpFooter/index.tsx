import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon, Link } from '@trussworks/react-uswds';

import IconLink from 'components/IconLink';
import { SLACK_OIT_DEV_FEEDBACK } from 'constants/externalUrls';

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
              icon={<Icon.Launch aria-hidden />}
              iconPosition="after"
              to="/help/report-a-problem"
              target="_blank"
            >
              {t('footer.reportProblem')}
            </IconLink>

            <IconLink
              className="font-body-3xs text-white text-no-underline"
              icon={<Icon.Launch aria-hidden />}
              iconPosition="after"
              to="/help/send-feedback"
              target="_blank"
            >
              {t('footer.sendFeedback')}
            </IconLink>

            <Link
              className="font-body-3xs text-white text-no-underline display-flex flex-align-center"
              href={SLACK_OIT_DEV_FEEDBACK}
              target="_blank"
            >
              {t('footer.chatOnSlack')}
              <Icon.Launch aria-hidden className="margin-left-1" />
            </Link>
          </div>
        </div>
        <Icon.LightbulbOutline
          className="text-primary-light"
          size={3}
          aria-hidden
        />
      </GridContainer>
    </div>
  );
};
