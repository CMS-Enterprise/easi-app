import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ButtonGroup, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import useTRBAttendees from 'hooks/useTRBAttendees';

import Breadcrumbs from '../../../components/shared/Breadcrumbs';

/**
 * Last form step for confirmation
 */
const Done = () => {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{ id: string }>();
  const { state } = useLocation<{ success?: boolean }>();
  const history = useHistory();

  const {
    data: { requester }
  } = useTRBAttendees(id);

  const success = state?.success;

  // Redirect to first step if success state is undefined
  if (success === undefined) {
    history.replace(`/trb/${id}/guidance/summary`);
  }

  return (
    <>
      <div
        className={classNames(
          {
            'bg-success-lighter': success,
            'bg-error-lighter': !success
          },
          'padding-bottom-6'
        )}
      >
        <GridContainer>
          <Breadcrumbs
            items={[
              { text: t('Home'), url: '/trb' },
              {
                text: t('adminHome.breadcrumb'),
                url: `/trb/${id}/guidance`
              },
              { text: t('guidanceLetterForm.heading') }
            ]}
          />
          <PageHeading className="margin-bottom-0">
            {t(`done.${success ? 'success' : 'error'}.heading`)}
          </PageHeading>
          <p className="font-body-lg line-height-body-5 text-light margin-top-05">
            {t(`guidanceLetterForm.done.${success ? 'success' : 'error'}`)}
          </p>
          <ButtonGroup>
            {!success && (
              <UswdsReactLink
                to={`/trb/${id}/guidance/review`}
                className="usa-button"
              >
                {t('guidanceLetterForm.done.backToGuidanceLetter')}
              </UswdsReactLink>
            )}
            <UswdsReactLink
              to={`/trb/${id}/request`}
              className={classNames('usa-button', {
                'usa-button--outline': !success,
                'margin-left-neg-05': success
              })}
            >
              {t('guidanceLetterForm.done.returnToRequestHome')}
            </UswdsReactLink>
          </ButtonGroup>
        </GridContainer>
      </div>

      <GridContainer className="margin-top-4">
        <dl className="grid-row easi-dl">
          <Grid col={6}>
            <dt>Project title</dt>
            <dd>{id}</dd>
          </Grid>
          <Grid col={6}>
            <dt>Requester</dt>
            <dd>{`${requester.userInfo?.commonName}, ${
              cmsDivisionsAndOffices.find(
                component => component.name === requester.component
              )?.acronym
            }`}</dd>
          </Grid>
        </dl>
      </GridContainer>
    </>
  );
};

export default Done;
