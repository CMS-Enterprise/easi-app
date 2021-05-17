import React from 'react';
import { DateTime } from 'luxon';

import { AccessibilityNoteListItem, AccessibilityNotesList } from './index';

export default {
  title: 'Accessibility Notes List',
  component: AccessibilityNotesList
};

export const Default = () => {
  const notes = [
    {
      content: 'here is some content',
      author: 'author name',
      createdAt: DateTime.local().toString()
    },
    {
      content: 'here is some content 2',
      author: 'author name',
      createdAt: DateTime.local().toString()
    }
  ];
  return (
    <AccessibilityNotesList>
      {notes.map(note => (
        <AccessibilityNoteListItem note={note} />
      ))}
    </AccessibilityNotesList>
  );
};
