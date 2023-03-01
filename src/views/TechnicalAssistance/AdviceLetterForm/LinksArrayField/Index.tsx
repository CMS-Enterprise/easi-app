import React from 'react';
import {
  Control,
  Controller,
  useFieldArray,
  UseFormWatch
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, IconAdd, TextInput } from '@trussworks/react-uswds';

import Label from 'components/shared/Label';
import { AdviceLetterRecommendationFields } from 'types/technicalAssistance';

type LinksArrayFieldProps = {
  control: Control<AdviceLetterRecommendationFields>;
  watch: UseFormWatch<AdviceLetterRecommendationFields>;
};

/**
 * TRB Recommendation links field using React Hook Forms useFieldArray hook
 */
export default function LinkArrayField({
  control,
  watch
}: LinksArrayFieldProps) {
  const { t } = useTranslation('technicalAssistance');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links'
  });

  /** Field value - updates on input change */
  const links = watch('links');

  return (
    <div id="trbLinksField">
      {/** Field inputs */}
      <ul className="usa-list usa-list--unstyled">
        {fields.map((item, index) => {
          return (
            <li key={item.id} className="maxw-tablet">
              <Label
                htmlFor={`links.${index}.link`}
                className="text-normal margin-top-3"
              >
                {t('Link')}
              </Label>
              <FormGroup className="margin-top-1 display-flex flex-align-center">
                {/** Link input */}
                <Controller
                  name={`links.${index}.link`}
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <TextInput
                        className="margin-top-0"
                        type="text"
                        id={`link.${item.id}`}
                        {...field}
                        ref={null}
                      />
                    );
                  }}
                />
                {/** Delete button */}
                <Button
                  type="button"
                  className="text-secondary margin-top-0 margin-left-1"
                  onClick={() => remove(index)}
                  unstyled
                >
                  {t('Delete')}
                </Button>
              </FormGroup>
            </li>
          );
        })}
      </ul>

      {/** Add link button */}
      <Button
        type="button"
        className="display-flex flex-align-center"
        onClick={() => {
          append({ link: '' });
        }}
        disabled={links?.at(-1)?.link?.length === 0}
        unstyled
      >
        <IconAdd className="margin-right-05" />
        {t(
          fields.length === 0
            ? 'adviceLetterForm.addResourceLink'
            : 'adviceLetterForm.addAnotherResourceLink'
        )}
      </Button>
    </div>
  );
}
