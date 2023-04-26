import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Accordion, Form } from '@trussworks/react-uswds';

import EmailRecipientFields from 'components/EmailRecipientFields';
import Divider from 'components/shared/Divider';
import useCacheQuery from 'hooks/useCacheQuery';
import useTRBAttendees from 'hooks/useTRBAttendees';
import GetTrbAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as AdminNote,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import {
  StepComponentProps,
  TrbRecipientFields
} from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';
import { trbActionSchema } from 'validations/trbRequestSchema';

import ReviewAdviceLetter from '../AdminHome/components/ReviewAdviceLetter';
import Pager from '../RequestForm/Pager';

const Review = ({
  trbRequestId,
  adviceLetter,
  adviceLetterStatus,
  setFormAlert,
  setStepSubmit,
  setIsStepSubmitting
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

  const {
    data: { attendees, requester },
    createAttendee
  } = useTRBAttendees(trbRequestId);

  const actionForm = useForm<TrbRecipientFields>({
    resolver: yupResolver(trbActionSchema()),
    defaultValues: {
      copyTrbMailbox: true,
      notifyEuaIds: []
    }
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = actionForm;

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <div id="trbAdviceReview" className="margin-top-5">
      {/* Notes */}
      <p>
        <Trans
          i18nKey="technicalAssistance:adviceLetterForm.notesCount"
          components={{ bold: <span className="text-bold" /> }}
          count={notes.length}
          values={{ plural: notes.length === 1 ? '' : 's' }}
        />
      </p>
      <Accordion
        items={notes.map((note, index) => ({
          id: `trbAdminNote${index}`,
          title: `from ${note.author.commonName} (${formatDateLocal(
            note.createdAt,
            'MM/dd/yyyy'
          )})`,
          content: note.noteText,
          expanded: false
        }))}
        bordered
      />

      {/* Review */}
      <ReviewAdviceLetter
        adviceLetter={adviceLetter}
        className="margin-top-5 margin-bottom-4"
        showEditLinks
      />

      <Divider />

      {/* <h3>{t('actionRequestEdits.notificationTitle')}</h3> */}

      <Form
        onSubmit={handleSubmit(formData => null)}
        className="maxw-full margin-bottom-205 tablet:grid-col-12 desktop:grid-col-6"
      >
        <FormProvider {...actionForm}>
          <EmailRecipientFields
            requester={requester}
            contacts={attendees}
            mailboxes={[
              {
                key: 'copyTrbMailbox',
                label: t('emailRecipientFields.copyTrbMailbox')
              }
            ]}
            createContact={contact =>
              createAttendee({ ...contact, trbRequestId })
            }
          />
        </FormProvider>

        {/** Form pager buttons */}
        <Pager
          className="margin-top-4"
          back={{
            outline: true,
            onClick: () =>
              history.push(`/trb/${trbRequestId}/advice/internal-review`)
          }}
          next={{
            type: 'submit',
            text: 'Send'
            // onClick: () => {
            //   // TODO: Submit
            //   history.push(`/trb/${trbRequestId}/request`);
            // }
          }}
          taskListUrl={`/trb/${trbRequestId}/request`}
          saveExitText={t('adviceLetterForm.returnToRequest')}
          border={false}
        />
      </Form>
    </div>
  );
};

export default Review;
