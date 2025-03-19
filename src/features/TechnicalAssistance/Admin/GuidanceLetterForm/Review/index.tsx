import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Accordion, Form } from '@trussworks/react-uswds';
import {
  GetTRBGuidanceLetterDocument,
  TRBAdminNoteFragment,
  useDeleteTRBGuidanceLetterInsightMutation,
  useGetTRBAdminNotesQuery,
  useSendTRBGuidanceLetterMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { RichTextViewer } from 'components/RichTextEditor';
import SectionWrapper from 'components/SectionWrapper';
import {
  StepComponentProps,
  TrbRecipientFields
} from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';
import { trbActionSchema } from 'validations/trbRequestSchema';

import Pager from '../../../Requester/RequestForm/Pager';
import Recipients from '../../_components/ActionFormWrapper/Recipients';
import useActionForm from '../../_components/ActionFormWrapper/useActionForm';
import ReviewGuidanceLetter from '../../_components/ReviewGuidanceLetter';

const Review = ({
  trbRequestId,
  guidanceLetter,
  guidanceLetterStatus,
  setFormAlert,
  setIsStepSubmitting,
  stepsCompleted,
  setStepsCompleted
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const { data } = useGetTRBAdminNotesQuery({
    variables: {
      id: trbRequestId
    }
  });

  const notes: TRBAdminNoteFragment[] = data?.trbRequest?.adminNotes || [];

  const [mutate, guidanceLetterResult] = useSendTRBGuidanceLetterMutation();

  const [remove] = useDeleteTRBGuidanceLetterInsightMutation({
    refetchQueries: [
      {
        query: GetTRBGuidanceLetterDocument,
        variables: {
          id: trbRequestId
        }
      }
    ]
  });

  const actionForm = useActionForm<TrbRecipientFields>({
    trbRequestId,
    copyITGovMailbox: true,
    resolver: yupResolver(trbActionSchema())
  });

  const {
    handleSubmit,
    formState: { isSubmitting, defaultValues }
  } = actionForm;

  const formSubmitting: boolean = isSubmitting || guidanceLetterResult.loading;

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <div id="trbGuidanceReview" className="margin-top-5">
      {/* Notes */}
      <p>
        <Trans
          i18nKey="technicalAssistance:guidanceLetterForm.notesCount"
          components={{ bold: <span className="text-bold" /> }}
          count={notes.length}
          values={{ plural: notes.length === 1 ? '' : 's' }}
        />
      </p>
      {notes.length > 0 ? (
        <Accordion
          items={notes.map((note, index) => ({
            id: `trbAdminNote${index}`,
            title: `from ${note.author.commonName} (${formatDateLocal(
              note.createdAt,
              'MM/dd/yyyy'
            )})`,
            content: <RichTextViewer value={note.noteText} />,
            expanded: false,
            headingLevel: 'h4'
          }))}
          bordered
        />
      ) : (
        <Alert type="warning" slim>
          {t('guidanceLetterForm.notesAlert')}
        </Alert>
      )}
      {/* Review */}
      <ReviewGuidanceLetter
        trbRequestId={trbRequestId}
        guidanceLetter={guidanceLetter}
        className="margin-top-5 margin-bottom-4"
        insightActions={{
          setReorderError: error =>
            setFormAlert(error ? { type: 'error', message: error } : null),
          edit: insight =>
            history.push(`/trb/${trbRequestId}/guidance/insights/form`, {
              insight: {
                ...insight,
                links: insight.links.map(link => ({ link }))
              }
            }),
          remove: insight =>
            remove({ variables: { id: insight.id } }).catch(() =>
              setFormAlert({
                type: 'error',
                message: t('guidanceLetterForm.error', {
                  action: 'removing',
                  type: 'guidance'
                })
              })
            )
        }}
        showSectionEditLinks
      />
      <SectionWrapper borderTop className="margin-top-6 padding-top-2">
        <h3 className="margin-bottom-1">
          {t('actionRequestEdits.notificationTitle')}
        </h3>
        <p className="line-height-body-5 margin-top-1">
          {t('actionRequestEdits.notificationDescription')}
        </p>
        <Form
          onSubmit={handleSubmit(formData =>
            mutate({
              variables: { input: { ...formData, id: guidanceLetter.id } }
            })
              .then(() => {
                if (
                  setStepsCompleted &&
                  stepsCompleted &&
                  !stepsCompleted?.includes('review')
                ) {
                  setStepsCompleted([...stepsCompleted, 'review']);
                }
                history.push(`/trb/${trbRequestId}/guidance/done`, {
                  success: true
                });
              })
              .catch(() => {
                if (
                  setStepsCompleted &&
                  stepsCompleted &&
                  !stepsCompleted?.includes('review')
                ) {
                  setStepsCompleted([...stepsCompleted, 'review']);
                }
                history.push(`/trb/${trbRequestId}/guidance/done`, {
                  success: false
                });
              })
          )}
          className="maxw-full margin-bottom-205 tablet:grid-col-12 desktop:grid-col-6"
        >
          <FormProvider<TrbRecipientFields> {...actionForm}>
            <Recipients copyITGovMailbox={defaultValues?.copyITGovMailbox} />
          </FormProvider>
          {/** Form pager buttons */}
          <Pager
            className="margin-top-6"
            back={{
              outline: true,
              onClick: () =>
                history.push(`/trb/${trbRequestId}/guidance/internal-review`)
            }}
            next={{
              text: t('Send'),
              disabled: formSubmitting,
              loading: formSubmitting
            }}
            taskListUrl={`/trb/${trbRequestId}/guidance`}
            saveExitText={t('guidanceLetterForm.returnToRequest')}
            submitDisabled
            border={false}
          />
        </Form>
      </SectionWrapper>
    </div>
  );
};

export default Review;
