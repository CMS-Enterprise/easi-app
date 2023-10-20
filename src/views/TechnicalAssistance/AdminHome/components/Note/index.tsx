/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import { GetTrbAdminNotes_trbRequest_adminNotes as NoteType } from 'queries/types/GetTrbAdminNotes';
import {
  TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData as AdviceLetterCategoryData,
  TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData as InitialRequestFormCategoryData
} from 'queries/types/TRBAdminNoteFragment';
import { formatDateLocal } from 'utils/date';

type NoteProps = {
  note: NoteType;
};

const Notes = ({ note }: NoteProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { categorySpecificData } = note;

  /** Converts initial request form category data into string */
  const initialRequestFormCategory = ({
    appliesToBasicRequestDetails,
    appliesToSubjectAreas,
    appliesToAttendees
  }: InitialRequestFormCategoryData) =>
    [
      ...(appliesToBasicRequestDetails
        ? [t('notes.labels.appliesToBasicRequestDetails')]
        : []),
      ...(appliesToSubjectAreas
        ? [t('notes.labels.appliesToSubjectAreas')]
        : []),
      ...(appliesToAttendees ? [t('notes.labels.appliesToAttendees')] : [])
    ].join(', ');

  /** Converts advice letter category data into string */
  const adviceLetterCategory = ({
    appliesToMeetingSummary,
    appliesToNextSteps,
    recommendations
  }: AdviceLetterCategoryData) =>
    [
      ...(appliesToMeetingSummary ? [t('notes.labels.meetingSummary')] : []),
      ...(appliesToNextSteps ? [t('notes.labels.nextSteps')] : []),
      recommendations.map(rec =>
        t('notes.labels.recommendation', { title: rec.title })
      )
    ].join(', ');

  /** Returns note category label with category specific data as string */
  const categoryString = () => {
    const categoryLabel = t(`notes.categories.${note.category}`);

    /** Category specific data converted to string */
    let categorySpecificDataString: string | undefined;

    switch (categorySpecificData.__typename) {
      case 'TRBAdminNoteInitialRequestFormCategoryData':
        categorySpecificDataString = initialRequestFormCategory(
          categorySpecificData
        );
        break;
      case 'TRBAdminNoteSupportingDocumentsCategoryData':
        categorySpecificDataString = categorySpecificData.documents
          .map(doc => doc.fileName)
          .join(', ');
        break;
      case 'TRBAdminNoteAdviceLetterCategoryData':
        categorySpecificDataString = adviceLetterCategory(categorySpecificData);
        break;

      default:
        break;
    }

    return `${categoryLabel}${
      categorySpecificDataString ? `: ${categorySpecificDataString}` : ''
    }`;
  };

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

          <p className="margin-top-0">{categoryString()}</p>

          <p>{note.noteText}</p>
        </div>
      </Grid>
    </Grid>
  );
};

export default Notes;
