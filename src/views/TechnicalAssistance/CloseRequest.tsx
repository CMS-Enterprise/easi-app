import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  CharacterCount,
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
import CloseTrbRequestQuery from 'queries/CloseTrbRequestQuery';
import {
  CloseTrbRequest,
  CloseTrbRequestVariables
} from 'queries/types/CloseTrbRequest';

import Breadcrumbs from './Breadcrumbs';

function CloseRequest() {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage /* , action */ } = useParams<{
    id: string;
    activePage: string;
    action: 'close-request';
  }>();
  const history = useHistory();

  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl = `/trb/${id}/${activePage}`;

  const actionText = 'actionCloseRequest';

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      text: ''
    }
  });

  const [mutate] = useMutation<CloseTrbRequest, CloseTrbRequestVariables>(
    CloseTrbRequestQuery
  );

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
            text: t('actionCloseRequest.breadcrumb')
          }
        ]}
      />

      {message}

      <Grid row>
        <PageHeading className="margin-bottom-0">
          {t(`${actionText}.heading`)}
        </PageHeading>
        <div className="line-height-body-5 font-body-lg text-light">
          {t(`${actionText}.description`)}
        </div>
      </Grid>
      <Grid row gap>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Form
            onSubmit={handleSubmit(formData => {
              mutate({
                variables: {
                  input: {
                    id,
                    reasonClosed: formData.text,
                    notifyEuaIds: ['ABCD'] // todo
                  }
                }
              })
                .then(result => {
                  showMessageOnNextPage(
                    <Alert type="success" slim className="margin-top-3">
                      {t(`${actionText}.success`)}
                    </Alert>
                  );
                  history.push(`/trb/${id}/request`);
                })
                .catch(err => {
                  showMessage(
                    <Alert type="error" slim className="margin-top-3">
                      {t(`${actionText}.error`)}
                    </Alert>
                  );
                });
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
              name="text"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label
                    htmlFor="text"
                    hint={
                      <div className="margin-top-1">
                        {t('actionCloseRequest.hint')}
                      </div>
                    }
                    className="text-normal margin-top-6"
                  >
                    {t(`${actionText}.label`)}
                  </Label>
                  <CharacterCount
                    {...field}
                    ref={null}
                    id="text"
                    maxLength={2000}
                    isTextArea
                    rows={2}
                    aria-describedby="text-info text-hint"
                  />
                </FormGroup>
              )}
            />
            <h3 className="margin-top-6">
              {t('actionRequestEdits.notificationTitle')}
            </h3>
            <div>{t('actionRequestEdits.notificationDescription')}</div>
            {/* todo cedar contacts */}
            <div>
              <Button type="submit" className="" disabled={isSubmitting}>
                {t('actionCloseRequest.submit')}
              </Button>
            </div>
          </Form>
        </Grid>
      </Grid>
      <div className="margin-top-2">
        <UswdsReactLink to={`${requestUrl}/${activePage}`}>
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default CloseRequest;
