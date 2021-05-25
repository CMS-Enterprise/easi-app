import React from 'react';

import { formatDate } from 'utils/date';

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
    <li className="accessibility-note__note-item">
      <div className="margin-bottom-2">
        <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
          {note.content}
        </p>
        <span className="text-base-dark font-body-2xs">{`by ${
          note.author
        } | ${formatDate(note.createdAt)}`}</span>
      </div>
    </li>
  );
};

export const AccessibilityNotesList = ({
  notes
}: {
  notes: AccessibilityNote[];
}) => {
  return (
    <ol aria-label={`${notes.length} existing notes`}>
      {notes.map(note => (
        <AccessibilityNoteListItem note={note} key={note.id} />
      ))}
    </ol>
  );
};
