import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

import WhatHappensNext from './WhatHappensNext';

/**
 * The last form step for confirmation.
 * This component does not use `FormStepHeader` or `Pager` like
 * the other `FormStepComponent`s.
 */
function Done({ breadcrumbBar }: { breadcrumbBar: React.ReactNode }) {
  const { t } = useTranslation('technicalAssistance');
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation<{ success?: boolean }>();
  const history = useHistory();

  const success = state?.success;

  // Redirect to first step if success state is undefined
  if (success === undefined) {
    history.replace(`/trb/requests/${id}`);
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
          <Grid row>
            <Grid col>
              {breadcrumbBar}

              <PageHeading className="margin-bottom-0">
                {t(`done.${success ? 'success' : 'error'}.heading`)}
              </PageHeading>
              <div className="font-body-lg line-height-body-5 text-light">
                {t(`done.${success ? 'success' : 'error'}.info`)}
              </div>
              <div className="margin-top-4">
                {success ? (
                  <UswdsReactLink
                    className="usa-button"
                    variant="unstyled"
                    to={`/trb/task-list/${id}`}
                  >
                    {t('done.returnToTaskList')}
                  </UswdsReactLink>
                ) : (
                  <>
                    <UswdsReactLink
                      className="usa-button"
                      variant="unstyled"
                      to={`/trb/requests/${id}`}
                    >
                      {t('done.backToTrbRequest')}
                    </UswdsReactLink>
                    <UswdsReactLink
                      className="usa-button usa-button--outline"
                      variant="unstyled"
                      to={`/trb/task-list/${id}`}
                    >
                      {t('done.returnToTaskList')}
                    </UswdsReactLink>
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </GridContainer>
      </div>

      <GridContainer>
        <dl className="easi-dl margin-top-4 margin-bottom-6">
          <dt>{t('done.referenceNumber')}</dt>
          <dd>{id}</dd>
        </dl>
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <WhatHappensNext />
          </Grid>
        </Grid>
      </GridContainer>
    </>
  );
}

export default Done;
