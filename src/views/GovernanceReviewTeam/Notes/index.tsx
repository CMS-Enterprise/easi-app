import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { DateTime } from 'luxon';
import CreateSystemIntakeNoteQuery from 'queries/CreateSystemIntakeNoteQuery';
import GetAdminNotesAndActionsQuery from 'queries/GetAdminNotesAndActionsQuery';
import {
  CreateSystemIntakeNote,
  CreateSystemIntakeNoteVariables
} from 'queries/types/CreateSystemIntakeNote';
import {
  GetAdminNotesAndActions,
  GetAdminNotesAndActionsVariables
} from 'queries/types/GetAdminNotesAndActions';

import {
  NoteByline,
  NoteContent,
  NoteListItem,
  NotesList
} from 'components/NotesList';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AnythingWrongSurvey } from 'components/Survey';
import { AppState } from 'reducers/rootReducer';
import { formatDate } from 'utils/date';

type NoteForm = {
  note: string;
};

const Notes = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const authState = useSelector((state: AppState) => state.auth);
  const [mutate, mutationResult] = useMutation<
    CreateSystemIntakeNote,
    CreateSystemIntakeNoteVariables
  >(CreateSystemIntakeNoteQuery, {
    refetchQueries: [
      {
        query: GetAdminNotesAndActionsQuery,
        variables: {
          id: systemId
        }
      }
    ]
  });

  const { error, data } = useQuery<
    GetAdminNotesAndActions,
    GetAdminNotesAndActionsVariables
  >(GetAdminNotesAndActionsQuery, {
    variables: {
      id: systemId
    }
  });
  const { t } = useTranslation('governanceReviewTeam');
  const onSubmit = (
    values: NoteForm,
    { resetForm }: FormikHelpers<NoteForm>
  ) => {
    const input = {
      intakeId: systemId,
      authorName: authState.name,
      content: values.note
    };
    mutate({ variables: { input } }).then(response => {
      if (!response.errors) {
        resetForm();
      }
    });
  };

  const initialValues = {
    note: ''
  };

  // New
  const notesByTimestamp =
    data?.systemIntake?.notes.map(note => {
      const { id, createdAt, content, author } = note;
      return {
        createdAt,
        element: (
          <NoteListItem key={id} isLinked data-testid="user-note">
            <NoteContent>{content}</NoteContent>
            <NoteByline>{`by ${author.name} | ${formatDate(
              createdAt
            )} at ${DateTime.fromISO(createdAt).toLocaleString(
              DateTime.TIME_SIMPLE
            )}`}</NoteByline>
          </NoteListItem>
        )
      };
    }) || [];

  const actionsByTimestamp =
    data?.systemIntake?.actions.map(action => {
      const { id, createdAt, type, actor, feedback } = action;
      return {
        createdAt,
        element: (
          <NoteListItem key={id} isLinked data-testid="action-note">
            <NoteContent>{t(`notes.actionName.${type}`)}</NoteContent>
            <NoteByline>{`by: ${actor.name} | ${formatDate(
              createdAt
            )} at ${DateTime.fromISO(createdAt).toLocaleString(
              DateTime.TIME_SIMPLE
            )}`}</NoteByline>
            {feedback && (
              <div className="margin-top-2">
                <CollapsableLink
                  id={`ActionEmailText-${id}`}
                  label={t('notes.showEmail')}
                  closeLabel={t('notes.hideEmail')}
                  styleLeftBar={false}
                >
                  {feedback}
                </CollapsableLink>
              </div>
            )}
          </NoteListItem>
        )
      };
    }) || [];

  const interleavedList = [...notesByTimestamp, ...actionsByTimestamp]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map(a => a.element);
  // New

  return (
    <>
      <PageHeading>{t('notes.heading')}</PageHeading>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formikProps: FormikProps<NoteForm>) => {
          const { values, handleSubmit } = formikProps;
          return (
            <div className="tablet:grid-col-9 margin-bottom-7">
              {mutationResult && mutationResult.error && (
                <ErrorAlert heading="Error">
                  <ErrorAlertMessage
                    message={mutationResult.error.message}
                    errorKey="note"
                  />
                </ErrorAlert>
              )}
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup>
                  <Label htmlFor="GovernanceReviewTeam-Note">
                    {t('notes.addNote')}
                  </Label>
                  <Field
                    as={TextAreaField}
                    id="GovernanceReviewTeam-Note"
                    maxLength={2000}
                    name="note"
                    className="easi-grt__note-field"
                  />
                </FieldGroup>
                <Button
                  className="margin-top-2"
                  type="submit"
                  disabled={!values.note}
                >
                  {t('notes.addNoteCta')}
                </Button>
              </Form>
              {error && (
                <Alert type="error">The notes could not be loaded.</Alert>
              )}
              {!error && data && (
                <NotesList className="margin-top-7 margin-left-1">
                  {interleavedList}
                </NotesList>
              )}
              <AnythingWrongSurvey />
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Notes;
