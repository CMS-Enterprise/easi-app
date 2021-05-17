import React from 'react';
import { DateTime } from 'luxon';

import './index.scss';

type AccessibilityNote = {
  content: string;
  author: string;
  createdAt: string;
  id: string;
};

export const AccessibilityNoteListItem = ({
  note
}: {
  note: AccessibilityNote;
}) => {
  return (
    <div className="accessibility-note__note-item" id={note.id}>
      <div className="margin-bottom-2">
        <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
          {note.content}
        </p>
        <span className="text-base-dark font-body-2xs">{`by ${
          note.author
        } | ${DateTime.fromISO(note.createdAt).toLocaleString(
          DateTime.DATE_FULL
        )}`}</span>
      </div>
    </div>
  );
};

export const AccessibilityNotesList = ({
  notes
}: {
  notes: AccessibilityNote[];
}) => {
  return (
    <div>
      <caption className="usa-sr-only">{`${notes.length} existing notes`}</caption>
      {notes.map(note => (
        <AccessibilityNoteListItem note={note} />
      ))}
    </div>
  );
};
