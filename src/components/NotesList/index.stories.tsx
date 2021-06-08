import React from 'react';

import { NoteByline, NoteContent, NoteListItem, NotesList } from './index';

export default {
  title: 'Accessibility Notes List',
  component: NotesList
};

const notes = [
  {
    id: '1',
    content:
      'The business case is not satisfactory. Requester needs to provide more details about alternative solutions.',
    byline: 'by John Smith | January 1 2021 at 11:59 AM'
  },
  {
    id: '2',
    content:
      '508 Testing has been requested. Please schedule a testing session with the requester.',
    byline: 'by John Smith | January 1 2021'
  }
];

export const Default = () => {
  return (
    <NotesList>
      {notes.map(note => (
        <NoteListItem>
          <NoteContent>{note.content}</NoteContent>
          <NoteByline>{note.byline}</NoteByline>
        </NoteListItem>
      ))}
    </NotesList>
  );
};

export const Linked = () => {
  return (
    <NotesList>
      {notes.map(note => (
        <NoteListItem isLinked>
          <NoteContent>{note.content}</NoteContent>
          <NoteByline>{note.byline}</NoteByline>
        </NoteListItem>
      ))}
    </NotesList>
  );
};

Linked.storyName = 'w/linked notes';
