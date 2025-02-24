import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ErrorMessage,
  FormGroup,
  Icon,
  TextInput
} from '@trussworks/react-uswds';

import Label from 'components/Label';
import { GuidanceLetterInsightFields } from 'types/technicalAssistance';

/**
 * TRB insight links field using React Hook Forms useFieldArray hook
 */
export default function LinkArrayField() {
  const { t } = useTranslation('technicalAssistance');

  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext<GuidanceLetterInsightFields>();

  const { fields, append, remove } = useFieldArray({
    name: 'links'
  });

  /** Field value - updates on input change */
  const links = watch('links') || [];

  /** Value of the last link input */
  const lastLinkInput: string | undefined = links.slice(-1)[0]?.link;

  return (
    <div id="trbLinksField">
      {
        /* Field inputs */
        links.length > 0 && (
          <ul className="usa-list usa-list--unstyled">
            {fields.map((item, index) => {
              return (
                <li key={item.id}>
                  <Controller
                    name={`links.${index}.link`}
                    control={control}
                    render={({ field }) => {
                      const error: boolean = !!errors.links?.[index]?.link;
                      return (
                        <FormGroup error={error}>
                          <Label
                            htmlFor={`links.${index}.link`}
                            className="text-normal margin-top-3"
                          >
                            {t('Link')}
                          </Label>

                          {error && (
                            <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                          )}

                          <div className="margin-top-1 display-flex flex-align-center">
                            <TextInput
                              className="margin-top-0"
                              type="url"
                              id={`links.${index}.link`}
                              data-testid={`links.${index}.link`}
                              {...field}
                              ref={null}
                            />
                            {/* Remove link button */}
                            <Button
                              type="button"
                              className="text-secondary margin-top-0 margin-left-2"
                              onClick={() => remove(index)}
                              unstyled
                            >
                              {t('Remove')}
                            </Button>
                          </div>
                        </FormGroup>
                      );
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )
      }

      {/* Add link button */}
      <Button
        type="button"
        className="display-flex flex-align-center margin-top-4"
        onClick={() => {
          append({ link: '' });
        }}
        disabled={links.length > 0 && !lastLinkInput}
        unstyled
      >
        <Icon.Add className="margin-right-05" />
        {t(
          fields.length === 0
            ? 'guidanceLetterForm.addResourceLink'
            : 'guidanceLetterForm.addAnotherResourceLink'
        )}
      </Button>
    </div>
  );
}
