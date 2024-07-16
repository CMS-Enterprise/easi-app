import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Form, FormGroup, Grid, IconArrowBack } from '@trussworks/react-uswds';

import CedarContactSelect from 'components/CedarContactSelect';
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
import {
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'types/graphql-global-types';

import { ReviewerKey } from '../subNavItems';

type GRBReviewerFormFields = {
  userAccount: {
    username: string;
    commonName: string;
  };
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
};

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

  const { control, handleSubmit } = useEasiForm<GRBReviewerFormFields>();

  const submit = handleSubmit(({ userAccount, ...values }) => {
    createGrbReviewer({
      variables: {
        input: {
          systemIntakeID: systemId,
          euaUserId: userAccount.username,
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
          <Label htmlFor="userAccount" required>
            {t('form.grbMemberName')}
          </Label>
          <HelpText id="userAccountHelpText" className="margin-top-05">
            {t('form.grbMemberNameHelpText')}
          </HelpText>
          <Controller
            control={control}
            name="userAccount"
            render={({ field: { ref, ...field } }) => (
              <CedarContactSelect
                {...field}
                id="euaUserId"
                value={{
                  euaUserId: field.value.username,
                  commonName: field.value.commonName
                }}
                onChange={contact =>
                  contact &&
                  field.onChange({
                    username: contact.euaUserId,
                    commonName: contact.commonName
                  })
                }
                ariaDescribedBy="userAccountHelpText"
              />
            )}
          />
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
