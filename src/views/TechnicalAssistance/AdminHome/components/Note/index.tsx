/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { GetTrbAdminNotes_trbRequest_adminNotes as NoteType } from 'queries/types/GetTrbAdminNotes';
import {
  TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData as AdviceLetterCategoryData,
  TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData as InitialRequestFormCategoryData
} from 'queries/types/TRBAdminNoteFragment';
import { formatDateLocal } from 'utils/date';

type NoteProps = {
  note: NoteType;
  className?: string;
  border?: boolean;
};

const Note = ({ note, className, border = true }: NoteProps) => {
  const { t } = useTranslation('technicalAssistance');
  const flags = useFlags();

  const { categorySpecificData, category } = note;

  const categoryLabel = t(`notes.categories.${category}`);

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
      ...recommendations.map(rec =>
        t('notes.labels.recommendation', { title: rec.title })
      )
    ].join(', ');

  /** Returns note category label with category specific data as string */
  const categoryString = () => {
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
    <dl
      data-testid="trb-note"
      className={classNames(
        'grid-row margin-bottom-3 margin-top-0 line-height-body-5',
        { 'border-bottom-1px border-base-light padding-bottom-3': border },
        className
      )}
    >
      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
        <dt className="text-bold">{t('notes.date')}</dt>
        <dd className="margin-left-0">
          {formatDateLocal(note.createdAt, 'MMMM d, yyyy')}
        </dd>
      </Grid>

      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
        <dt className="text-bold">{t('notes.author')}</dt>
        <dd className="margin-left-0">{note.author.commonName}</dd>
      </Grid>

      <Grid
        desktop={{ col: 12 }}
        className="bg-base-lightest padding-x-3 padding-y-205"
      >
        <dt className="text-bold">{t('notes.about')}</dt>
        <dd className="margin-left-0">
          {
            // TODO EASI-3467: Remove conditional logic when feature flag is removed
            flags.trbAdminNoteUpdates ? categoryString() : categoryLabel
          }
        </dd>

        <dd className="margin-left-0 margin-top-2">{note.noteText}</dd>
      </Grid>
    </dl>
  );
};

export default Note;
