import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewDocument,
  SystemIntakeGRBReviewerFragment,
  useCreateSystemIntakeGRBReviewersMutation
} from 'gql/generated/graphql';

import IconLink from 'components/IconLink';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { TabPanel, Tabs } from 'components/Tabs';
import useMessage from 'hooks/useMessage';
import { GRBReviewerFields, GRBReviewFormAction } from 'types/grbReview';

import AddReviewerFromEua from './AddReviewerFromEua';
import AddReviewersFromRequest from './AddReviewersFromRequest';

type GRBReviewerFormProps = {
  isFromGRBSetup: boolean;
  initialGRBReviewers: SystemIntakeGRBReviewerFragment[];
  grbReviewStartedAt?: string | null;
};

/**
 * Form to add or edit a GRB reviewer
 */
const GRBReviewerForm = ({
  isFromGRBSetup,
  initialGRBReviewers,
  grbReviewStartedAt
}: GRBReviewerFormProps) => {
  const { t } = useTranslation('grbReview');

  const { showMessage, showMessageOnNextPage } = useMessage();

  const history = useHistory();

  const { systemId, action } = useParams<{
    systemId: string;
    action: GRBReviewFormAction;
  }>();

  const [mutate] = useCreateSystemIntakeGRBReviewersMutation({
    refetchQueries: [GetSystemIntakeGRBReviewDocument]
  });

  const grbReviewPath = isFromGRBSetup
    ? `/it-governance/${systemId}/grb-review/participants`
    : `/it-governance/${systemId}/grb-review`;

  const createGRBReviewers = (reviewers: GRBReviewerFields[]) =>
    mutate({
      variables: {
        input: {
          systemIntakeID: systemId,
          reviewers: reviewers.map(({ userAccount, ...reviewer }) => ({
            ...reviewer,
            euaUserId: userAccount.username
          }))
        }
      }
    })
      .then(() => {
        showMessageOnNextPage(
          <Trans
            i18nKey="grbReview:messages.success.add"
            count={reviewers.length}
          />,
          { type: 'success' }
        );

        history.push(grbReviewPath);
      })
      .catch(() => {
        showMessage(t(`messages.error.add`), { type: 'error' });

        // Scroll to error
        const err = document.querySelector('.usa-alert');
        err?.scrollIntoView();
      });

  return (
    <GridContainer>
      <Grid className="padding-y-4 margin-bottom-205">
        <h1 className="margin-bottom-1">{t('form.title')}</h1>
        <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105 tablet:grid-col-8">
          {t('form.description')}
        </p>

        <p className="margin-top-1 text-base">
          <Trans
            i18nKey="action:fieldsMarkedRequired"
            components={{ asterisk: <RequiredAsterisk /> }}
          />
        </p>

        <IconLink
          icon={<Icon.ArrowBack />}
          to={grbReviewPath}
          className="margin-top-3 margin-bottom-5"
        >
          {t('form.returnToRequest', { context: action })}
        </IconLink>

        {
          /**
           * Only show tabbed layout when adding new reviewer(s)
           *
           * Otherwise, show add from EUA form
           */
          action === 'add' ? (
            <Tabs defaultActiveTab={t('form.addViaEUA')}>
              <TabPanel
                id="addReviewerFromEua"
                tabName={t('form.addViaEUA')}
                className="outline-0"
              >
                <AddReviewerFromEua
                  grbReviewPath={grbReviewPath}
                  systemId={systemId}
                  initialGRBReviewers={initialGRBReviewers}
                  createGRBReviewers={createGRBReviewers}
                  grbReviewStartedAt={grbReviewStartedAt}
                  isFromGRBSetup={isFromGRBSetup}
                />
              </TabPanel>
              <TabPanel
                id="addReviewersFromRequest"
                tabName={t('form.addFromRequest')}
                className="outline-0"
              >
                <AddReviewersFromRequest
                  grbReviewPath={grbReviewPath}
                  systemId={systemId}
                  createGRBReviewers={createGRBReviewers}
                />
              </TabPanel>
            </Tabs>
          ) : (
            <AddReviewerFromEua
              grbReviewPath={grbReviewPath}
              systemId={systemId}
              initialGRBReviewers={initialGRBReviewers}
              createGRBReviewers={createGRBReviewers}
              grbReviewStartedAt={grbReviewStartedAt}
              isFromGRBSetup={isFromGRBSetup}
            />
          )
        }
      </Grid>
    </GridContainer>
  );
};

export default GRBReviewerForm;
