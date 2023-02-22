import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
// import { useMutation } from '@apollo/client';
import {
  // Alert,
  Button,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';

import Breadcrumbs from '../Breadcrumbs';

function Consult() {
  const { t } = useTranslation('technicalAssistance');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, activePage, action } = useParams<{
    id: string;
    activePage: string;
    action: 'consult';
  }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl = `/trb/${id}/${activePage}`;

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      meetingDate: '',
      meetingTime: ''
    }
  });

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: `/trb` },
          {
            text: t('adminHome.breadcrumb', { trbRequestId: id }),
            url: requestUrl
          },
          {
            text: t(
              'adminHome.taskStatuses.attendConsultStatus.READY_TO_SCHEDULE'
            )
          }
        ]}
      />

      {message}

      <Grid row>
        <PageHeading className="margin-bottom-0">
          {t('actionConsult.heading')}
        </PageHeading>
        <div className="line-height-body-5 font-body-lg text-light">
          {t('actionConsult.description')}
        </div>
      </Grid>
      <Grid row gap>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Form
            onSubmit={handleSubmit(formData => {
              /*
              mutate({
                variables: {
                  input: {
                    trbRequestId: id,
                  }
                }
              })
                .then(result => {
                  showMessageOnNextPage(
                    <Alert type="success" slim className="margin-top-3">
                      {t('actionConsult.success')}
                    </Alert>
                  );
                  history.push(requestUrl);
                })
                .catch(err => {
                  showMessage(
                    <Alert type="error" slim className="margin-top-3">
                      {t('actionConsult.error')}
                    </Alert>
                  );
                });
              */
            })}
            className="maxw-full"
          >
            <div className="margin-top-1 text-base">
              <Trans
                i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
                components={{ red: <span className="text-red" /> }}
              />
            </div>
            <Controller
              name="meetingDate"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label
                    htmlFor="meetingDate"
                    hint={
                      <div className="margin-top-1">
                        {t('actionConsult.hints.meetingDate')}
                      </div>
                    }
                    className="text-normal margin-top-6"
                  >
                    {t('actionConsult.labels.meetingDate')}
                  </Label>
                </FormGroup>
              )}
            />
            <Controller
              name="meetingTime"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label
                    htmlFor="meetingTime"
                    hint={
                      <div className="margin-top-1">
                        {t('actionConsult.hints.meetingTime')}
                      </div>
                    }
                    className="text-normal margin-top-6"
                  >
                    {t('actionConsult.labels.meetingTime')}
                  </Label>
                </FormGroup>
              )}
            />
            <h3 className="margin-top-6">
              {t('actionRequestEdits.notificationTitle')}
            </h3>
            <div>{t('actionRequestEdits.notificationDescription')}</div>
            {/* todo cedar contacts */}
            <div>
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {t('actionRequestEdits.submit')}
              </Button>
            </div>
          </Form>
        </Grid>
      </Grid>
      <div className="margin-top-2">
        <UswdsReactLink to={requestUrl}>
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default Consult;
