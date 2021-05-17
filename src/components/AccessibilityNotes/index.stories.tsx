import React from 'react';
import { DateTime } from 'luxon';

import { AccessibilityNotesList } from './index';

export default {
  title: 'Accessibility Notes List',
  component: AccessibilityNotesList
};

export const Default = () => {
  const notes = [
    {
      content: 'here is some content',
      author: 'author name',
      createdAt: DateTime.local().toString(),
      id: '1'
    },
    {
      content: 'here is some content 2',
      author: 'author name',
      createdAt: DateTime.local().toString(),
      id: '2'
    }
  ];
  return <AccessibilityNotesList notes={notes} />;
};
