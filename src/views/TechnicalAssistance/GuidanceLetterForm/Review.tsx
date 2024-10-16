import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Accordion, Form } from '@trussworks/react-uswds';

import { RichTextViewer } from 'components/RichTextEditor';
import Alert from 'components/shared/Alert';
import SectionWrapper from 'components/shared/SectionWrapper';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTrbAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  DeleteTrbRecommendationQuery,
  GetTrbGuidanceLetterQuery,
  SendTRBGuidanceLetterQuery
} from 'queries/TrbGuidanceLetterQueries';
import {
  DeleteTRBRecommendation,
  DeleteTRBRecommendationVariables
} from 'queries/types/DeleteTRBRecommendation';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as AdminNote,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import {
  SendTRBGuidanceLetter,
  SendTRBGuidanceLetterVariables
} from 'queries/types/SendTRBGuidanceLetter';
import {
  StepComponentProps,
  TrbRecipientFields
} from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';
import { trbActionSchema } from 'validations/trbRequestSchema';

import Recipients from '../AdminHome/components/ActionFormWrapper/Recipients';
import useActionForm from '../AdminHome/components/ActionFormWrapper/useActionForm';
import ReviewGuidanceLetter from '../AdminHome/components/ReviewGuidanceLetter';
import Pager from '../RequestForm/Pager';

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

  const { data } = useCacheQuery<GetTrbAdminNotes, GetTrbAdminNotesVariables>(
    GetTrbAdminNotesQuery,
    {
      variables: {
        id: trbRequestId
      }
    }
  );

  const notes: AdminNote[] = data?.trbRequest?.adminNotes || [];

  const [mutate, guidanceLetterResult] = useMutation<
    SendTRBGuidanceLetter,
    SendTRBGuidanceLetterVariables
  >(SendTRBGuidanceLetterQuery);

  const [remove] = useMutation<
    DeleteTRBRecommendation,
    DeleteTRBRecommendationVariables
  >(DeleteTrbRecommendationQuery, {
    refetchQueries: [
      {
        query: GetTrbGuidanceLetterQuery,
        variables: {
          id: trbRequestId
        }
      }
    ]
  });

  const actionForm = useActionForm<TrbRecipientFields>({
    trbRequestId,
    resolver: yupResolver(trbActionSchema()),
    defaultValues: {
      copyTrbMailbox: true
    }
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
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
            expanded: false
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
        recommendationActions={{
          setReorderError: error =>
            setFormAlert(error ? { type: 'error', message: error } : null),
          edit: recommendation =>
            history.push(`/trb/${trbRequestId}/guidance/insights/form`, {
              recommendation: {
                ...recommendation,
                links: recommendation.links.map(link => ({ link }))
              }
            }),
          remove: recommendation =>
            remove({ variables: { id: recommendation.id } }).catch(() =>
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
            <Recipients />
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
