import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import NotesModal from '../NoteModal';

type NoteBoxProps = {
  trbRequestId: string;
};

const NoteBox = ({ trbRequestId }: NoteBoxProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [addNote, setAddNote] = useState(false);

  const notesCount = 0;

  return (
    <>
      {isNotesOpen && (
        <NotesModal
          isOpen={isNotesOpen}
          trbRequestId={trbRequestId}
          addNote={addNote}
          closeModal={() => setIsNotesOpen(false)}
        />
      )}
      <div
        className="trb-admin-home__request-notes bg-base-lightest padding-x-2 padding-y-1 margin-bottom-3"
        data-testid="trb-admin-home__request-notes"
      >
        <p className="margin-y-0 line-height-body-5">
          <span className="text-bold">{notesCount}</span>{' '}
          {t('requestNotes.text')}
        </p>
        <ButtonGroup>
          <Button
            type="button"
            data-testid="note-modal-button"
            unstyled
            onClick={() => {
              setAddNote(false);
              setIsNotesOpen(true);
            }}
          >
            {t('requestNotes.viewNotes')}
          </Button>

          <Button
            type="button"
            data-testid="note-modal-button"
            unstyled
            onClick={() => {
              setAddNote(true);
              setIsNotesOpen(true);
            }}
          >
            {t('requestNotes.addNote')}
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default NoteBox;
