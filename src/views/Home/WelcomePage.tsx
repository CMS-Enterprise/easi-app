import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid,
  Icon
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { IconList, IconListItem } from 'components/shared/IconList';
import useOktaSession from 'hooks/useOktaSession';

import './welcome.scss';

const WelcomeText = () => {
  const { t } = useTranslation('home');

  const { hasSession, oktaAuth } = useOktaSession();

  return (
    <>
      {/* Intro */}
      <section
        id="easi-welcome-header"
        className="grid-container bg-primary-dark text-white padding-bottom-8"
      >
        <Grid row>
          <PageHeading className="margin-bottom-1 text-normal">
            <Trans
              i18nKey="home:welcome.title"
              components={{
                span: <span />
              }}
            />
          </PageHeading>
          <p className="margin-top-2 margin-bottom-6 desktop:margin-bottom-8 font-body-xl tablet:font-body-2xl text-primary-lighter text-light">
            {t('welcome.intro')}
          </p>
        </Grid>
      </section>

      {/* Cards */}
      <section
        id="easi-intro-cards"
        className="grid-container bg-base-lightest padding-bottom-6 desktop:padding-bottom-8"
      >
        <Grid row>
          <CardGroup className="margin-bottom-1 margin-top-neg-8">
            <Card className="desktop:grid-col-6">
              <CardHeader>
                <h3>{t('welcome.toolsToHelp.title')}</h3>
              </CardHeader>
              <CardBody className="padding-bottom-4">
                <IconList className="font-body-lg">
                  {t<string[]>('welcome.toolsToHelp.list', {
                    returnObjects: true
                  }).map(item => {
                    return (
                      <IconListItem
                        key={item}
                        icon={<Icon.Check className="text-green" />}
                      >
                        {item}
                      </IconListItem>
                    );
                  })}
                </IconList>
              </CardBody>
            </Card>
            <Card className="desktop:grid-col-6">
              <CardHeader>
                <h3>{t('welcome.noMore.title')}</h3>
              </CardHeader>
              <CardBody className="padding-bottom-4">
                <IconList className="font-body-lg text-light">
                  {t<string[]>('welcome.noMore.list', {
                    returnObjects: true
                  }).map(item => {
                    return (
                      <IconListItem
                        key={item}
                        icon={
                          <Icon.Close
                            className="text-red margin-right-1"
                            size={3}
                          />
                        }
                      >
                        {item}
                      </IconListItem>
                    );
                  })}
                </IconList>
              </CardBody>
            </Card>
          </CardGroup>

          {/* If a user has an active okta session, replace router link with a button that automicatally authenticates the user for EASI.  Bypasses /signin */}
          {hasSession ? (
            <Button
              type="button"
              className="usa-button width-auto"
              onClick={() => oktaAuth.signInWithRedirect()}
            >
              {t('signIn')}
            </Button>
          ) : (
            <UswdsReactLink className="usa-button width-auto" to="/signin">
              {t('signIn')}
            </UswdsReactLink>
          )}
        </Grid>
      </section>

      {/* Future features */}
      <section
        id="easi-future-features"
        className="grid-container bg-primary-lighter padding-top-1 desktop:padding-top-3 padding-bottom-4 desktop:padding-bottom-6"
      >
        <Grid row>
          <h2>{t('welcome.futureFeatures')}</h2>
          <CardGroup>
            <Card className="desktop:grid-col-4">
              <CardHeader className="padding-bottom-0">
                <Icon.NotificationsActive
                  size={5}
                  className="text-primary-vivid"
                />
                <h3 className="line-height-body-2">
                  {t('welcome.automation')}
                </h3>
              </CardHeader>
              <CardBody>
                <p>{t('welcome.automationDescription')}</p>
              </CardBody>
            </Card>
            <Card className="desktop:grid-col-4">
              <CardHeader className="padding-bottom-0">
                <Icon.Groups size={5} className="text-primary-vivid" />
                <h3 className="line-height-body-2">
                  {t('welcome.collaboration')}
                </h3>
              </CardHeader>
              <CardBody>
                <p>{t('welcome.collaborationDescription')}</p>
              </CardBody>
            </Card>
            <Card className="desktop:grid-col-4">
              <CardHeader className="padding-bottom-0">
                <Icon.Edit size={5} className="text-primary-vivid" />
                <h3 className="line-height-body-2">{t('welcome.editing')}</h3>
              </CardHeader>
              <CardBody>
                <p>{t('welcome.editingDescription')}</p>
              </CardBody>
            </Card>
          </CardGroup>
        </Grid>
      </section>

      {/* Capabilities */}
      <section
        id="easi-capabilities"
        className="grid-container padding-top-1 desktop:padding-top-3 desktop:padding-bottom-5"
      >
        <Grid row>
          <h2 className="grid-col-12">{t('welcome.capabilities')}</h2>
          <Grid col className="grid-col-12 desktop:grid-col-4">
            <h3 className="line-height-body-2 margin-bottom-0 margin-top-105">
              {t('welcome.lifecycleIds')}
            </h3>
            <p className="line-height-body-5 margin-top-1">
              {t('welcome.lifecycleIdsDescription')}
            </p>
          </Grid>
          <Grid col className="grid-col-12 desktop:grid-col-4">
            <h3 className="line-height-body-2 margin-bottom-0 margin-top-105">
              {t('welcome.systemInformation')}
            </h3>
            <p className="line-height-body-5 margin-top-1">
              {t('welcome.systemInformationDescription')}
            </p>
          </Grid>
          <Grid col className="grid-col-12 desktop:grid-col-4">
            <h3 className="line-height-body-2 margin-bottom-0 margin-top-105">
              {t('welcome.trb')}
            </h3>
            <p className="line-height-body-5 margin-top-1">
              {t('welcome.trbDescription')}
            </p>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default WelcomeText;
