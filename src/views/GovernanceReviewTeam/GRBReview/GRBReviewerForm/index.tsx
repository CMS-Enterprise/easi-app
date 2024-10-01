import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, IconArrowBack } from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewersDocument,
  SystemIntakeGRBReviewerFragment,
  useCreateSystemIntakeGRBReviewersMutation
} from 'gql/gen/graphql';

import IconLink from 'components/shared/IconLink';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import { TabPanel, Tabs } from 'components/Tabs';

import AddReviewerFromEua from './AddReviewerFromEua';
import BulkAddGRBReviewersForm from './BulkAddGRBReviewersForm';

type GRBReviewerFormProps = {
  initialGRBReviewers: SystemIntakeGRBReviewerFragment[];
  setReviewerToRemove: (reviewer: SystemIntakeGRBReviewerFragment) => void;
  grbReviewStartedAt?: string | null;
};

/**
 * Form to add or edit a GRB reviewer
 */
const GRBReviewerForm = ({
  initialGRBReviewers,
  setReviewerToRemove,
  grbReviewStartedAt
}: GRBReviewerFormProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId, action } = useParams<{
    systemId: string;
    action: 'add' | 'edit';
  }>();

  const [createGRBReviewers] = useCreateSystemIntakeGRBReviewersMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersDocument,
        variables: { id: systemId }
      }
    ]
  });

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  return (
    <>
      {/* TODO: server error message */}

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
          icon={<IconArrowBack />}
          to={grbReviewPath}
          className="margin-top-3 margin-bottom-5"
        >
          {t('form.returnToRequest', { context: action })}
        </IconLink>

        <Tabs defaultActiveTab={t('form.addViaEUA')}>
          <TabPanel id="addReviewerFromEua" tabName={t('form.addViaEUA')}>
            <div className="tablet:grid-col-6 margin-bottom-4">
              <AddReviewerFromEua
                systemId={systemId}
                initialGRBReviewers={initialGRBReviewers}
                createGRBReviewers={createGRBReviewers}
                setReviewerToRemove={setReviewerToRemove}
                grbReviewStartedAt={grbReviewStartedAt}
              />
            </div>
          </TabPanel>
          <TabPanel
            id="addReviewersFromRequest"
            tabName={t('form.addFromRequest')}
          >
            <BulkAddGRBReviewersForm
              systemId={systemId}
              createGRBReviewers={createGRBReviewers}
            />
          </TabPanel>
        </Tabs>
      </Grid>
    </>
  );
};

export default GRBReviewerForm;
