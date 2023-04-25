import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Accordion } from '@trussworks/react-uswds';

import Divider from 'components/shared/Divider';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTrbAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as AdminNote,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import { StepComponentProps } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';

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

  // useEffect(() => {
  //   setIsStepSubmitting(isSubmitting);
  // }, [setIsStepSubmitting, isSubmitting]);

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

      {/** Form pager buttons */}
      <Pager
        className="margin-top-4"
        back={{
          outline: true,
          onClick: () =>
            history.push(`/trb/${trbRequestId}/advice/internal-review`)
        }}
        next={{
          text: 'Send',
          onClick: () => {
            // TODO: Submit
            history.push(`/trb/${trbRequestId}/request`);
          }
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </div>
  );
};

export default Review;
