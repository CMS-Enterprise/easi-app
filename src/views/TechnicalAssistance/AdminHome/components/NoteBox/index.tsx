/*
Admin request component for toggling <NoteModal /> component
Can open modal initiated with <AddNote /> or <Notes />
*/

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@trussworks/react-uswds';

import { TRBAdminNoteCategory } from 'types/graphql-global-types';
import { TrbAdminPath } from 'types/technicalAssistance';

import NotesModal from '../NoteModal';

export const noteCategoryPageMap: Partial<
  Record<TrbAdminPath, TRBAdminNoteCategory>
> = {
  guidance: TRBAdminNoteCategory.GUIDANCE_LETTER,
  request: TRBAdminNoteCategory.GENERAL_REQUEST,
  'initial-request-form': TRBAdminNoteCategory.INITIAL_REQUEST_FORM,
  documents: TRBAdminNoteCategory.SUPPORTING_DOCUMENTS
};

type NoteBoxProps = {
  trbRequestId: string;
  noteCount: number;
  activePage: TrbAdminPath;
};

const NoteBox = ({ trbRequestId, noteCount, activePage }: NoteBoxProps) => {
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
          defaultSelect={noteCategoryPageMap[activePage]}
        />
      )}
      <div
        className="trb-admin-home__request-notes bg-base-lightest padding-x-2 padding-y-1 margin-bottom-3"
        data-testid="trb-admin-home__request-notes"
      >
        <p
          className="margin-y-0 line-height-body-5"
          data-testid="note-box-count"
        >
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
