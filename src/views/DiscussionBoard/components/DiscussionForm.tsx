import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, Form, FormGroup } from '@trussworks/react-uswds';
import {
  useCreateSystemIntakeGRBDiscussionPostMutation,
  useCreateSystemIntakeGRBDiscussionReplyMutation
} from 'gql/gen/graphql';

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

type DiscussionFormProps =
  | {
      type: 'discussion';
      systemIntakeID: string;
      closeModal: () => void;
    }
  | {
      type: 'reply';
      initialPostID: string;
      closeModal: () => void;
    };

/**
 * Form for adding a discussion post or responding to a discussion
 * within the discussion board
 */
const DiscussionForm = ({
  type,
  closeModal,
  ...mutationProps
}: DiscussionFormProps) => {
  const { t } = useTranslation('discussions');

  const [mutateDiscussion] = useCreateSystemIntakeGRBDiscussionPostMutation();

  const [mutateReply] = useCreateSystemIntakeGRBDiscussionReplyMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors }
  } = useEasiForm<DiscussionContent>({
    resolver: yupResolver(discussionSchema)
  });

  const createDiscussion = handleSubmit(({ content }) => {
    if ('systemIntakeID' in mutationProps) {
      mutateDiscussion({
        variables: {
          input: {
            systemIntakeID: mutationProps.systemIntakeID,
            content
          }
        }
      })
        .then(() => {
          // TODO: set success message
        })
        .catch(e => {
          // TODO: set error message
        });
    }
  });

  const createReply = handleSubmit(({ content }) => {
    if ('initialPostID' in mutationProps) {
      mutateReply({
        variables: {
          input: {
            initialPostID: mutationProps.initialPostID,
            content
          }
        }
      })
        .then(() => {
          // Reset field values
          reset();

          // TODO: set success message
        })
        .catch(e => {
          // TODO: set error message
        });
    }
  });

  return (
    <Form
      onSubmit={type === 'discussion' ? createDiscussion : createReply}
      className="maxw-none"
    >
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
        <Button type="submit" disabled={!isValid}>
          {t('general.discussionForm.save', { type })}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default DiscussionForm;
