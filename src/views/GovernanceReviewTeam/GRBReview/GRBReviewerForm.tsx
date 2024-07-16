import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Form, FormGroup, Grid, IconArrowBack } from '@trussworks/react-uswds';

import { useEasiForm } from 'components/EasiForm';
import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import { CreateSystemIntakeGRBReviewerQuery } from 'queries/SystemIntakeGRBReviewerQueries';
import {
  CreateSystemIntakeGRBReviewer,
  CreateSystemIntakeGRBReviewerVariables
} from 'queries/types/CreateSystemIntakeGRBReviewer';
import { CreateSystemIntakeGRBReviewerInput } from 'types/graphql-global-types';

import { ReviewerKey } from '../subNavItems';

type GRBReviewerFormFields = Omit<
  CreateSystemIntakeGRBReviewerInput,
  'systemIntakeID'
>;

const GRBReviewerForm = () => {
  const { t } = useTranslation('grbReview');

  const { reviewerType, systemId } = useParams<{
    reviewerType: ReviewerKey;
    systemId: string;
  }>();

  const [createGrbReviewer] = useMutation<
    CreateSystemIntakeGRBReviewer,
    CreateSystemIntakeGRBReviewerVariables
  >(CreateSystemIntakeGRBReviewerQuery);

  const { handleSubmit } = useEasiForm<GRBReviewerFormFields>();

  const submit = handleSubmit(values => {
    createGrbReviewer({
      variables: {
        input: {
          systemIntakeID: systemId,
          ...values
        }
      }
    });
  });

  return (
    <Grid className="tablet:grid-col-8 padding-y-4">
      <h1 className="margin-bottom-1">{t('form.title')}</h1>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105">
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
        to={`/${reviewerType}/${systemId}/governance-review`}
        className="margin-top-3"
      >
        {t('form.returnToRequest')}
      </IconLink>

      <Form onSubmit={submit} className="maxw-none tablet:grid-col-10">
        <FormGroup>
          <Label htmlFor="euaUserId" required>
            {t('form.grbMemberName')}
          </Label>
          <HelpText id="grbMemberNameHelpText" className="margin-top-05">
            {t('form.grbMemberNameHelpText')}
          </HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="votingRole" required>
            {t('form.votingRole')}
          </Label>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="grbRole" required>
            {t('form.grbRole')}
          </Label>
          <HelpText id="grbRoleHelpText" className="margin-top-05">
            {t('form.grbRoleHelpText')}
          </HelpText>
        </FormGroup>
      </Form>
    </Grid>
  );
};

export default GRBReviewerForm;
