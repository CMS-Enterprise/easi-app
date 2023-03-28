/*
Admin request component for toggling <NoteModal /> component
Can open modal initiated with <AddNote /> or <Notes />
*/

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@trussworks/react-uswds';

import NotesModal from '../NoteModal';

type NoteBoxProps = {
  trbRequestId: string;
  noteCount: number;
};

const NoteBox = ({ trbRequestId, noteCount }: NoteBoxProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);

  // Passes state to modal to render <AddNote /> or <Notes />
  const [addNote, setAddNote] = useState<boolean>(false);

  return (
    <>
      {isNotesOpen && (
        <NotesModal
          isOpen={isNotesOpen}
          trbRequestId={trbRequestId}
          addNote={addNote}
          openModal={setIsNotesOpen}
        />
      )}
      <div
        className="trb-admin-home__request-notes bg-base-lightest padding-x-2 padding-y-1 margin-bottom-3"
        data-testid="trb-admin-home__request-notes"
      >
        <p className="margin-y-0 line-height-body-5">
          <span className="text-bold">{noteCount}</span>{' '}
          {t('requestNotes.text', {
            plural: noteCount !== 1 ? 's' : ''
          })}
        </p>

        <div className="margin-top-05 display-flex">
          {/* View notes */}
          <Grid desktop={{ col: 6 }}>
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
          </Grid>

          <Grid desktop={{ col: 6 }}>
            {/* Add notes */}
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
          </Grid>
        </div>
      </div>
    </>
  );
};

export default NoteBox;
