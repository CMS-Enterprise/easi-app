import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import { GetTrbAdminNotes_trbRequest_adminNotes as NoteType } from 'queries/types/GetTrbAdminNotes';
import { formatDateLocal } from 'utils/date';

type NoteProps = {
  note: NoteType;
};

const Notes = ({ note }: NoteProps) => {
  const { t } = useTranslation('technicalAssistance');

  return (
    <Grid row className="margin-bottom-4">
      <Grid desktop={{ col: 6 }}>
        <dt className="text-bold">{t('notes.date')}</dt>
        <dd className="margin-left-0 margin-bottom-2 line-height-body-5">
          {formatDateLocal(note.createdAt, 'MMMM d, yyyy')}
        </dd>
      </Grid>

      <Grid desktop={{ col: 6 }}>
        <dt className="text-bold">{t('notes.author')}</dt>
        <dd className="margin-left-0 margin-bottom-2 line-height-body-5">
          {note.author.commonName}
        </dd>
      </Grid>

      <Grid desktop={{ col: 12 }} className="margin-top-1">
        <div className="bg-base-lightest padding-x-4 padding-y-1 margin-bottom-3">
          <p className="margin-bottom-0 text-bold">{t('notes.about')}</p>

          <p className="margin-top-0">
            {t(`notes.categories.${note.category}`)}
          </p>

          <p>{note.noteText}</p>
        </div>
      </Grid>
    </Grid>
  );
};

export default Notes;
