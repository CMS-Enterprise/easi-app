import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GetTRBAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as GetTrbAdminNotesType,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { NotFoundPartial } from 'views/NotFound';

import Note from './components/Note';

const Notes = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, error, loading } = useQuery<
    GetTrbAdminNotes,
    GetTrbAdminNotesVariables
  >(GetTRBAdminNotesQuery, {
    variables: { id: trbRequestId }
  });

  console.log(data);

  // const notes: GetTrbAdminNotesType | undefined = data?.trbRequest?.adminNotes;

  const notes: GetTrbAdminNotesType[] = [
    {
      __typename: 'TRBAdminNote',
      id: '123',
      isArchived: false,
      category: TRBAdminNoteCategory.ADVICE_LETTER,
      noteText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget commodo, maecenas id scelerisque tortor velit mi, euismod arcu. Velit non vulputate tortor urna nulla sit diam at. Parturient leo in pellentesque cras in hendrerit. In sapien gravida ut enim arcu nunc at. Nam scelerisque nisl tempor a. Sit sit dolor donec at proin aliquet amet, lacus, morbi. Sed vel sit non quam gravida sem.',
      author: {
        __typename: 'UserInfo',
        commonName: 'Patrick Segura'
      },
      createdAt: '2023-02-25T19:22:40Z'
    },
    {
      __typename: 'TRBAdminNote',
      id: '124',
      isArchived: false,
      category: TRBAdminNoteCategory.ADVICE_LETTER,
      noteText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget commodo, maecenas id scelerisque tortor velit mi, euismod arcu. Velit non vulputate tortor urna nulla sit diam at. Parturient leo in pellentesque cras in hendrerit. In sapien gravida ut enim arcu nunc at. Nam scelerisque nisl tempor a. Sit sit dolor donec at proin aliquet amet, lacus, morbi. Sed vel sit non quam gravida sem.',
      author: {
        __typename: 'UserInfo',
        commonName: 'Vicente Martin'
      },
      createdAt: '2023-02-25T19:22:40Z'
    }
  ];

  if (error) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="trb-admin-home__notes line-height-body-5"
      data-testid="trb-admin-home__notes"
      id={`trbAdminNotes-${trbRequestId}`}
    >
      <h1 className="margin-top-0 margin-bottom-1 line-height-heading-2">
        {t('adminHome.subnav.notes')}
      </h1>

      <p>{t('notes.description')}</p>

      <UswdsReactLink
        to={`/trb/${trbRequestId}/notes/add-note`}
        className="usa-button margin-bottom-6"
        variant="unstyled"
      >
        {t('notes.addNote')}
      </UswdsReactLink>

      {loading && <PageLoading />}

      {!notes ? (
        <Alert type="info" slim>
          {t('notes.noNotes')}
        </Alert>
      ) : (
        notes.map(note => <Note note={note} key={note.id} />)
      )}
    </div>
  );
};

export default Notes;
