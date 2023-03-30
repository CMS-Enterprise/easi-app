import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTRBAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as GetTrbAdminNotesType,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import { NotFoundPartial } from 'views/NotFound';

import Note from './components/Note';
import { ModalViewType } from './components/NoteModal';

const Notes = ({
  trbRequestId,
  setModalView, // prop used to conditionall render text/links/etc specifically for modal
  modalMessage
}: {
  trbRequestId: string;
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
  modalMessage?: string;
}) => {
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

  return (
    <div
      className="trb-admin-home__notes line-height-body-5"
      data-testid="trb-admin-home__notes"
      id={`trbAdminNotes-${trbRequestId}`}
    >
      <h1 className="margin-top-0 margin-bottom-1 line-height-heading-2">
        {t('adminHome.subnav.notes')}
      </h1>

      <p>{t('notes.description')}</p>

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
          className="usa-button margin-bottom-4"
          variant="unstyled"
        >
          {t('notes.addNote')}
        </UswdsReactLink>
      )}

      {modalMessage && (
        <Alert type="success" slim className="margin-top-0 margin-bottom-4">
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
    </div>
  );
};

export default Notes;
