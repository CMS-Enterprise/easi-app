import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GridContainer,
  IconLightbulbOutline,
  Link
} from '@trussworks/react-uswds';

const NewWindowLink = ({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    className="font-body-3xs text-white text-no-underline"
    href={href}
    variant="external"
    target="_blank"
  >
    {children}
  </Link>
);

export default () => {
  const { t } = useTranslation('help');
  return (
    <div className="display-flex padding-y-2 bg-primary-dark text-white">
      <GridContainer className="display-flex flex-fill desktop:flex-align-center">
        <div className="desktop:display-flex flex-fill">
          <div className="width-full desktop:width-auto margin-right-8">
            <h4 className="margin-0 line-height-heading-2">
              {t('footer.wantToHelp')}
            </h4>
          </div>
          <div className="display-flex margin-top-2 desktop:margin-top-0">
            <div className="margin-right-6">
              <NewWindowLink href="/help/report-a-problem">
                {t('footer.reportProblem')}
              </NewWindowLink>
            </div>
            <div className="margin-right-6">
              <NewWindowLink href="/help/send-feedback">
                {t('footer.sendFeedback')}
              </NewWindowLink>
            </div>
            <div>
              <NewWindowLink href="https://cmsgov.slack.com/archives/C038D4UJ6KC">
                {t('footer.chatOnSlack')}
              </NewWindowLink>
            </div>
          </div>
        </div>
        <div className="flex-auto">
          <IconLightbulbOutline className="text-primary-light" size={3} />
        </div>
      </GridContainer>
    </div>
  );
};
