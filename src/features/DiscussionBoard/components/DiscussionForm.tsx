import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, Form, FormGroup } from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBDiscussionsDocument,
  useCreateSystemIntakeGRBDiscussionPostMutation,
  useCreateSystemIntakeGRBDiscussionReplyMutation
} from 'gql/generated/graphql';

import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import MentionTextArea from 'components/MentionTextArea';
import RequiredAsterisk from 'components/RequiredAsterisk';
import useDiscussionParams from 'hooks/useDiscussionParams';
import { DiscussionAlert, MentionSuggestion } from 'types/discussions';
import discussionSchema from 'validations/discussionSchema';

type DiscussionContent = {
  content: string;
};

interface DiscussionFormProps {
  setDiscussionAlert: (discussionAlert: DiscussionAlert) => void;
  closeModal: () => void;
  mentionSuggestions: MentionSuggestion[];
}

interface DiscussionProps extends DiscussionFormProps {
  type: 'discussion';
  systemIntakeID: string;
}

interface ReplyProps extends DiscussionFormProps {
  type: 'reply';
  initialPostID: string;
}

/**
 * Form for adding a discussion post or responding to a discussion
 * within the discussion board
 */
const DiscussionForm = ({
  type,
  closeModal,
  setDiscussionAlert,
  mentionSuggestions,
  ...mutationProps
}: DiscussionProps | ReplyProps) => {
  const { t } = useTranslation('discussions');

  const [mutateDiscussion] = useCreateSystemIntakeGRBDiscussionPostMutation({
    refetchQueries: [GetSystemIntakeGRBDiscussionsDocument]
  });

  const [mutateReply] = useCreateSystemIntakeGRBDiscussionReplyMutation({
    refetchQueries: [GetSystemIntakeGRBDiscussionsDocument]
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors }
  } = useEasiForm<DiscussionContent>({
    resolver: yupResolver(discussionSchema),
    defaultValues: {
      content: ''
    }
  });

  const { pushDiscussionQuery } = useDiscussionParams();

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
          setDiscussionAlert({
            message: t('general.alerts.startDiscussionSuccess'),
            type: 'success'
          });
        })
        .catch(e => {
          setDiscussionAlert({
            message: t('general.alerts.startDiscussionError'),
            type: 'error'
          });
        })
        .finally(() => {
          pushDiscussionQuery({ discussionMode: 'view' });
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

          setDiscussionAlert({
            message: t('general.alerts.replySuccess'),
            type: 'success'
          });
        })
        .catch(e => {
          setDiscussionAlert({
            message: t('general.alerts.replyError'),
            type: 'error'
          });
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
            <MentionTextArea
              id={`mention-${type}`}
              ref={ref}
              editable
              className="height-auto"
              initialContent={field.value}
              setFieldValue={field.onChange}
              mentionSuggestions={mentionSuggestions}
            />
          )}
        />
      </FormGroup>

      <ButtonGroup>
        <Button
          type="button"
          outline
          onClick={() => pushDiscussionQuery({ discussionMode: 'view' })}
        >
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
