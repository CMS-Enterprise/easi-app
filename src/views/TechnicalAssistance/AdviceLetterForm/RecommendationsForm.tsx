import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  FormGroup,
  IconAdd,
  IconArrowBack,
  TextInput
} from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AdviceLetterRecommendationFields } from 'types/technicalAssistance';

import Breadcrumbs from '../Breadcrumbs';

const RecommendationsForm = ({ trbRequestId }: { trbRequestId: string }) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [
    recommendation,
    setRecommendation
  ] = useState<AdviceLetterRecommendationFields>({
    title: '',
    description: '',
    links: []
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

      <div className="maxw-tablet">
        {/** Title */}
        <FormGroup>
          <Label htmlFor="title" required>
            {t('Title')}
          </Label>
          <TextInput
            type="text"
            name="title"
            id="recommendationTitle"
            value={recommendation.title}
            onChange={e =>
              setRecommendation({ ...recommendation, title: e.target.value })
            }
          />
        </FormGroup>

        {/** Description */}
        <FormGroup>
          <Label htmlFor="description" required>
            {t('Description')}
          </Label>
          <TextAreaField
            name="description"
            id="recommendationDescription"
            value={recommendation.description}
            onChange={e =>
              setRecommendation({
                ...recommendation,
                description: e.target.value
              })
            }
            onBlur={() => null}
          />
        </FormGroup>

        <Button
          unstyled
          type="button"
          className="display-flex flex-align-center margin-bottom-2"
        >
          <IconAdd className="margin-right-05" />
          {t('adviceLetterForm.addResourceLink')}
        </Button>
      </div>

      {/** Save */}
      <Button
        type="submit"
        disabled={!recommendation.title && !recommendation.description}
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
