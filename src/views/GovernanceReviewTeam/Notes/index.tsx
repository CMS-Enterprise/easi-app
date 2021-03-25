import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { DateTime } from 'luxon';
import GetAdminNotesQuery from 'queries/GetAdminNotesQuery';
import {
  GetAdminNotes,
  GetAdminNotesVariables
} from 'queries/types/GetAdminNotes';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AnythingWrongSurvey } from 'components/Survey';
import { AppState } from 'reducers/rootReducer';
import { Action } from 'types/action';
import { fetchActions, postIntakeNote } from 'types/routines';
import { IntakeNote } from 'types/systemIntake';

type NoteForm = {
  note: string;
};

const NoteListItem = ({ note }: { note: IntakeNote }) => {
  return (
    <li className="easi-grt__history-item">
      <div className="easi-grt__history-item-content">
        <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
          {note.content}
        </p>
        <span className="text-base-dark font-body-2xs">{`by: ${
          note.author.name
        } | ${DateTime.fromISO(note.createdAt).toLocaleString(
          DateTime.DATE_FULL
        )} at ${DateTime.fromISO(note.createdAt).toLocaleString(
          DateTime.TIME_SIMPLE
        )}`}</span>
      </div>
    </li>
  );
};

const ActionListItem = ({ action }: { action: Action }) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <li className="easi-grt__history-item">
      <div className="easi-grt__history-item-content">
        <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
          {t(`notes.actionName.${action.actionType}`)}
        </p>
        <span className="text-base-dark font-body-2xs display-block">
          {`by: ${action.actorName} | ${action.createdAt.toLocaleString(
            DateTime.DATE_FULL
          )} at ${action.createdAt.toLocaleString(DateTime.TIME_SIMPLE)}`}
        </span>
        {action.feedback && (
          <div className="margin-top-2">
            <CollapsableLink
              id={`ActionEmailText-${action.id}`}
              label={t('notes.showEmail')}
              closeLabel={t('notes.hideEmail')}
              styleLeftBar={false}
            >
              {action.feedback}
            </CollapsableLink>
          </div>
        )}
      </div>
    </li>
  );
};

const Notes = () => {
  const dispatch = useDispatch();
  const { systemId } = useParams<{ systemId: string }>();
  const authState = useSelector((state: AppState) => state.auth);
  const actions = useSelector((state: AppState) => state.action.actions);

  const {
    error: notesError,
    data: notesData,
    refetch: notesRefetch
  } = useQuery<GetAdminNotes, GetAdminNotesVariables>(GetAdminNotesQuery, {
    variables: {
      id: systemId
    }
  });
  const { t } = useTranslation('governanceReviewTeam');
  const onSubmit = async (
    values: NoteForm,
    { resetForm }: FormikHelpers<NoteForm>
  ) => {
    await dispatch(
      postIntakeNote({
        intakeId: systemId,
        authorName: authState.name,
        authorId: authState.euaId,
        content: values.note
      })
    );
    notesRefetch();
    await resetForm();
  };

  useEffect(() => {
    dispatch(fetchActions(systemId));
  }, [dispatch, systemId]);

  const initialValues = {
    note: ''
  };

  const notesByTimestamp =
    notesData?.systemIntake?.notes.map(note => {
      return {
        createdAt: note.createdAt,
        element: <NoteListItem note={note} key={note.id} />
      };
    }) || [];

  const actionsByTimestamp = actions.map((action: Action) => {
    return {
      createdAt: action.createdAt,
      element: <ActionListItem action={action} key={action.id} />
    };
  });

  const interleavedList = [...notesByTimestamp, ...actionsByTimestamp]
    .sort()
    .map(a => a.element);

  return (
    <>
      <PageHeading>{t('notes.heading')}</PageHeading>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formikProps: FormikProps<NoteForm>) => {
          const { values } = formikProps;
          return (
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
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
              {notesError && (
                <Alert type="error">The notes could not be loaded.</Alert>
              )}
              {!notesError && notesData && (
                <ul className="easi-grt__history">{interleavedList}</ul>
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
