import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ErrorMessage,
  FormGroup,
  IconArrowBack,
  TextInput
} from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AdviceLetterRecommendationFields } from 'types/technicalAssistance';
import { adviceRecommendationSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../Breadcrumbs';

import LinksArrayField from './LinksArrayField/Index';

type RecommendationsFormProps = {
  trbRequestId: string;
};

const RecommendationsForm = ({ trbRequestId }: RecommendationsFormProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const {
    control,
    watch,
    formState: { isSubmitting }
  } = useForm<AdviceLetterRecommendationFields>({
    resolver: yupResolver(adviceRecommendationSchema),
    defaultValues: {
      title: '',
      description: '',
      links: []
    }
  });

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
      <h1 className="margin-bottom-0">
        {t('adviceLetterForm.addRecommendation')}
      </h1>
      {/** Required fields text */}
      <HelpText className="margin-top-1 margin-bottom-2">
        <Trans
          i18nKey="technicalAssistance:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>

      {/** Title */}
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup className="maxw-tablet margin-top-3" error={!!error}>
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

      {/** Description */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup className="maxw-tablet margin-top-3" error={!!error}>
              <Label className="text-normal" htmlFor="description" required>
                {t('Description')}
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <TextAreaField id="description" {...field} ref={null} required />
            </FormGroup>
          );
        }}
      />

      <LinksArrayField control={control} watch={watch} />

      {/** Save */}
      <Button
        type="submit"
        className="margin-top-6"
        disabled={
          watch('title').length === 0 ||
          watch('description').length === 0 ||
          isSubmitting
        }
        // TODO: submit recommendation
        onClick={() => null}
      >
        {t('button.save')}
      </Button>

      {/** Return without adding recommendation */}
      <Button
        className="margin-top-2 display-flex flex-align-center"
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
