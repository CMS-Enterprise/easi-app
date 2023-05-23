import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTRBAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as GetTrbAdminNotesType,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import { GetTrbRequestSummary_trbRequest as GetTrbRequestSummaryType } from 'queries/types/GetTrbRequestSummary';
import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import { NotFoundPartial } from 'views/NotFound';

import Note from './components/Note';
import { ModalViewType } from './components/NoteModal';
import TrbAdminWrapper from './components/TrbAdminWrapper';

interface NotesProps {
  trbRequestId: string;
  trbRequest?: GetTrbRequestSummaryType;
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
  modalMessage?: string;
}

const Notes = ({
  trbRequestId,
  trbRequest,
  setModalView, // prop used to conditionall render text/links/etc specifically for modal
  modalMessage
}: NotesProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [noteCount, setNoteCount] = useState<number>(5);

  const { data, error, loading } = useCacheQuery<
    GetTrbAdminNotes,
    GetTrbAdminNotesVariables
  >(GetTRBAdminNotesQuery, {
    variables: {
      id: trbRequestId
    }
  });

  const notes: GetTrbAdminNotesType[] = data?.trbRequest?.adminNotes || [];

  if (error) {
    return <NotFoundPartial />;
  }

  const adminActionDisabled: boolean =
    trbRequest?.state !== TRBRequestState.CLOSED &&
    trbRequest?.status !== TRBRequestStatus.ADVICE_LETTER_SENT;

  return (
    <TrbAdminWrapper
      activePage="notes"
      trbRequestId={trbRequestId}
      title={t('adminHome.notes')}
      description={t('notes.description')}
      disableStep={adminActionDisabled}
      adminActionProps={{
        status: trbRequest?.status || TRBRequestStatus.NEW,
        state: trbRequest?.state || TRBRequestState.OPEN
      }}
    >
      {setModalView ? (
        <Button
          type="button"
          className="margin-bottom-4"
          onClick={() => {
            setModalView('addNote');
          }}
        >
          {t('notes.addNote')}
        </Button>
      ) : (
        <UswdsReactLink
          to={`/trb/${trbRequestId}/notes/add-note`}
          className={classNames('usa-button margin-bottom-4', {
            'margin-top-4': !adminActionDisabled
          })}
          variant="unstyled"
        >
          {t('notes.addNote')}
        </UswdsReactLink>
      )}

      {modalMessage && (
        <Alert type="success" className="margin-top-0 margin-bottom-4">
          {modalMessage}
        </Alert>
      )}

      {loading && <PageLoading />}

      {notes.length === 0 ? (
        <Alert type="info" slim className="margin-top-0">
          {t('notes.noNotes')}
        </Alert>
      ) : (
        <div className="margin-top-2">
          {/* Show most recent notes first */}
          {[...notes] // TODO: BE will implement filter to ensure correct ordering
            .sort((a, b) => {
              return a.createdAt < b.createdAt ? 1 : -1;
            })
            .filter((note, index) => index < noteCount)
            .map(note => (
              <Note note={note} key={note.id} />
            ))}

          {notes.length > 5 && !(noteCount > notes.length) && (
            <Button
              type="button"
              className="usa-button usa-button--unstyled"
              onClick={() => {
                setNoteCount(noteCount + 5);
              }}
            >
              {t('notes.viewMore')}
            </Button>
          )}
        </div>
      )}
    </TrbAdminWrapper>
  );
};

export default Notes;
