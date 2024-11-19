import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, Form, FormGroup } from '@trussworks/react-uswds';

import { useEasiForm } from 'components/EasiForm';
import RichTextEditor from 'components/RichTextEditor';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import discussionSchema from 'validations/discussionSchema';

type DiscussionContent = {
  content: string;
};

type DiscussionFormProps = {
  type: 'discussion' | 'reply';
  closeModal: () => void;
};

/**
 * Form for adding a discussion post or responding to a discussion
 * within the discussion board
 */
const DiscussionForm = ({ type, closeModal }: DiscussionFormProps) => {
  const { t } = useTranslation('discussions');

  const {
    control,
    formState: { isValid, errors }
  } = useEasiForm<DiscussionContent>({
    resolver: yupResolver(discussionSchema)
  });

  return (
    <Form onSubmit={() => null} className="maxw-none">
      <p className="margin-top-1 margin-bottom-5 text-base">
        <Trans
          i18nKey="discussions:general.fieldsMarkedRequired"
          components={{ asterisk: <RequiredAsterisk /> }}
        />
      </p>

      <FormGroup error={!!errors.content}>
        <Label
          required
          htmlFor="content"
          className="text-normal margin-bottom-1"
        >
          {t('general.discussionForm.contentLabel', { context: type })}
        </Label>
        <HelpText id="contentHelpText">
          {t('general.discussionForm.helpText')}
        </HelpText>

        <ErrorMessage errors={errors} name="content" as={FieldErrorMsg} />

        <Controller
          name="content"
          control={control}
          render={({ field: { ref, ...field } }) => (
            // TODO: Update to use <MentionTextArea /> when completed
            <RichTextEditor
              field={field}
              editableProps={{
                id: field.name,
                'aria-describedby': 'contentHelpText'
              }}
              required
            />
          )}
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="button" outline onClick={closeModal}>
          {t('general.cancel')}
        </Button>
        <Button type="submit" onClick={closeModal} disabled={!isValid}>
          {t('general.discussionForm.save', { type })}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default DiscussionForm;
