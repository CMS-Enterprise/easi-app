import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Card,
  CardGroup,
  Grid,
  GridContainer,
  IconCheck,
  IconClose
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { IconList, IconListItem } from 'components/shared/IconList';

import './welcome.scss';

const WelcomeText = () => {
  const { t } = useTranslation('home');

  return (
    <div id="easiWelcomePage">
      {/* Intro */}
      <GridContainer className="bg-primary-dark text-white">
        <Grid row>
          <PageHeading className="margin-bottom-1 text-normal easi-header-title">
            <Trans
              i18nKey="home:welcome.title"
              components={{
                span: <span />
              }}
            />
          </PageHeading>
          <p className="margin-top-1 margin-bottom-5 font-body-lg text-light line-height-body-5">
            {t('welcome.intro')}
          </p>
        </Grid>
      </GridContainer>

      {/* Cards */}
      <GridContainer className="bg-base-lightest">
        <Grid row>
          <Grid col={6}>
            <h3>{t('welcome.toolsToHelp.title')}</h3>
            <IconList className="font-body-lg">
              {t<string[]>('welcome.toolsToHelp.list', {
                returnObjects: true
              }).map(item => {
                return (
                  <IconListItem
                    key={item}
                    icon={<IconCheck className="text-green" />}
                  >
                    {item}
                  </IconListItem>
                );
              })}
            </IconList>
          </Grid>
          <Grid col={6}>
            <h3>{t('welcome.noMore.title')}</h3>
            <IconList className="font-body-lg">
              {t<string[]>('welcome.noMore.list', {
                returnObjects: true
              }).map(item => {
                return (
                  <IconListItem
                    key={item}
                    icon={
                      <IconClose className="text-red margin-right-1" size={3} />
                    }
                  >
                    {item}
                  </IconListItem>
                );
              })}
            </IconList>
          </Grid>
          <UswdsReactLink className="usa-button" to="/signin">
            {t('signIn')}
          </UswdsReactLink>
        </Grid>
      </GridContainer>

      {/* Future features */}
      <GridContainer className="bg-primary-lighter">
        <Grid row>
          <h2>{t('welcome.futureFeatures')}</h2>
          <CardGroup>
            <Card className="grid-col-4">
              <h3>{t('welcome.automation')}</h3>
              <p>{t('welcome.automationDescription')}</p>
            </Card>
            <Card className="grid-col-4">
              <h3>{t('welcome.collaboration')}</h3>
              <p>{t('welcome.collaborationDescription')}</p>
            </Card>
            <Card className="grid-col-4">
              <h3>{t('welcome.editing')}</h3>
              <p>{t('welcome.editingDescription')}</p>
            </Card>
          </CardGroup>
        </Grid>
      </GridContainer>

      {/* Capabilities */}
      <GridContainer>
        <Grid row>
          <h2 className="grid-col-12">{t('welcome.capabilities')}</h2>
          <Grid col>
            <h3>{t('welcome.lifecycleIds')}</h3>
            <p>{t('welcome.lifecycleIdsDescription')}</p>
          </Grid>
          <Grid col>
            <h3>{t('welcome.systemInformation')}</h3>
            <p>{t('welcome.systemInformationDescription')}</p>
          </Grid>
          <Grid col>
            <h3>{t('welcome.trb')}</h3>
            <p>{t('welcome.trbDescription')}</p>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default WelcomeText;
