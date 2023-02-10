import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CharacterCount,
  ErrorMessage,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

function RequestEdits() {
  const { t } = useTranslation('technicalAssistance');
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      feedbackMessage: ''
    }
  });

  return (
    <GridContainer className="width-full">
      <Grid row>
        <PageHeading>{t('actionRequestEdits.heading')}</PageHeading>
        <div>{t('actionRequestEdits.description')}</div>
      </Grid>
      <Grid row gap>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Form
            onSubmit={handleSubmit(formData => {
              // console.log('submit', formData);
            })}
            className="maxw-full"
          >
            <div>{t('actionRequestEdits.fieldsMarkedRequired')}</div>
            <Controller
              name="feedbackMessage"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormGroup error={!!error}>
                  <Label
                    htmlFor="feedbackMessage"
                    hint={<div>{t('actionRequestEdits.hint')}</div>}
                    error={!!error}
                  >
                    {t('actionRequestEdits.label')}
                  </Label>
                  {error && <ErrorMessage>error</ErrorMessage>}
                  <CharacterCount
                    {...field}
                    ref={null}
                    id="proposedSolution"
                    maxLength={2000}
                    isTextArea
                    rows={2}
                    aria-describedby="feedbackMessage-info feedbackMessage-hint"
                    error={!!error}
                  />
                </FormGroup>
              )}
            />
            <h3>{t('actionRequestEdits.notificationTitle')}</h3>
            <div>{t('actionRequestEdits.notificationDescription')}</div>
            {/* cedar contacts */}
            <div>
              <Button type="submit" className="" disabled={isSubmitting}>
                {t('actionRequestEdits.submit')}
              </Button>
            </div>
          </Form>
        </Grid>
      </Grid>
      <div>
        <UswdsReactLink to="">
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default RequestEdits;
