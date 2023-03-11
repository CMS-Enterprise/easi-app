import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ErrorMessage,
  Form,
  FormGroup,
  IconArrowBack,
  TextInput
} from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import {
  CreateTrbRecommendationQuery,
  UpdateTrbRecommendationQuery
} from 'queries/TrbAdviceLetterQueries';
import {
  CreateTRBAdviceLetterRecommendationInput,
  UpdateTRBAdviceLetterRecommendationInput
} from 'types/graphql-global-types';
import {
  AdviceLetterRecommendationFields,
  FormAlertObject
} from 'types/technicalAssistance';
import { adviceRecommendationSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../Breadcrumbs';

import LinksArrayField from './LinksArrayField/Index';

type RecommendationsFormProps = {
  trbRequestId: string;
  /** Set a form level alert message from within step components */
  setFormAlert: React.Dispatch<React.SetStateAction<FormAlertObject | null>>;
};

const RecommendationsForm = ({
  trbRequestId,
  setFormAlert
}: RecommendationsFormProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [showFormError, setShowFormError] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, isDirty }
  } = useForm<AdviceLetterRecommendationFields>({
    resolver: yupResolver(adviceRecommendationSchema),
    defaultValues: {
      title: '',
      recommendation: '',
      links: []
    }
  });

  const [create] = useMutation<CreateTRBAdviceLetterRecommendationInput>(
    CreateTrbRecommendationQuery
  );

  const [update] = useMutation<UpdateTRBAdviceLetterRecommendationInput>(
    UpdateTrbRecommendationQuery
  );

  /** Submits form and executes recommendation mutation */
  const submit = useCallback(() => {
    const submitForm = handleSubmit(
      async formData => {
        if (isDirty) {
          /** Format links to array of strings */
          const links = (formData.links || []).map(({ link }) => link);

          /** Creates new or updates existing recommendation */
          const mutate = formData?.id ? update : create;

          await mutate({
            variables: {
              input: {
                trbRequestId,
                id: formData?.id,
                title: formData.title,
                recommendation: formData.recommendation,
                links
              }
            }
          });
        }
      },
      // Throw error to cause promise to fail
      () => {
        throw new Error('Invalid form submission');
      }
    );

    return submitForm().then(
      () => {
        setShowFormError(false);
        setFormAlert({
          type: 'success',
          message: t('adviceLetterForm.recommendationSuccess')
        });
        history.push(`/trb/${trbRequestId}/advice/recommendations`);
      },
      e => {
        if (e instanceof ApolloError) {
          setShowFormError(true);
        }
      }
    );
  }, [
    t,
    handleSubmit,
    isDirty,
    trbRequestId,
    update,
    create,
    history,
    setFormAlert
  ]);

  return (
    <div>
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/trb' },
          {
            text: t(`Request ${trbRequestId}`),
            url: `/trb/${trbRequestId}/advice`
          },
          {
            text: t('adviceLetterForm.heading'),
            url: `/trb/${trbRequestId}/advice/recommendations`
          },
          {
            text: t('adviceLetterForm.addRecommendation')
          }
        ]}
      />

      {
        /* Error alert for gql errors */
        showFormError && (
          <Alert type="error" className="margin-bottom-5" slim>
            {t('adviceLetterForm.error', { type: 'recommendation' })}
          </Alert>
        )
      }

      <h1 className="margin-bottom-0">
        {t('adviceLetterForm.addRecommendation')}
      </h1>
      {/* Required fields text */}
      <HelpText className="margin-top-1 margin-bottom-2">
        <Trans
          i18nKey="technicalAssistance:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>

      <Form
        onSubmit={() =>
          submit().then(() =>
            history.push(`/trb/${trbRequestId}/advice/recommendations`)
          )
        }
        className="maxw-tablet"
      >
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup className="margin-top-3" error={!!error}>
                <Label className="text-normal" htmlFor="title" required>
                  {t('Title')}
                </Label>
                {error && <ErrorMessage>{t('fillBlank')}</ErrorMessage>}
                <TextInput
                  type="text"
                  id="title"
                  {...field}
                  ref={null}
                  required
                />
              </FormGroup>
            );
          }}
        />

        {/* Description */}
        <Controller
          name="recommendation"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup className="margin-top-3" error={!!error}>
                <Label
                  className="text-normal"
                  htmlFor="recommendation"
                  required
                >
                  {t('Description')}
                </Label>
                {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
                <TextAreaField
                  id="recommendation"
                  {...field}
                  ref={null}
                  required
                />
              </FormGroup>
            );
          }}
        />

        {/* Links */}
        <LinksArrayField control={control} watch={watch} />

        {/* Save */}
        <Button
          type="submit"
          className="margin-top-6"
          disabled={
            watch('title').length === 0 ||
            watch('recommendation').length === 0 ||
            isSubmitting
          }
          onClick={() => submit()}
        >
          {t('button.save')}
        </Button>
      </Form>

      {/* Return without adding recommendation */}
      <Button
        className="margin-top-205 display-flex flex-align-center"
        type="button"
        unstyled
        onClick={() =>
          history.push(`/trb/${trbRequestId}/advice/recommendations`)
        }
      >
        <IconArrowBack className="margin-right-05" />
        {t('adviceLetterForm.returnToAdviceLetter')}
      </Button>
    </div>
  );
};

export default RecommendationsForm;
