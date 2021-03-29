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
  GetAdminNotesAndActions_systemIntake_actions as GetAdminNotesAndActionsSystemIntakeAction,
  GetAdminNotesAndActions_systemIntake_notes as GetAdminNotesAndActionsSystemIntakeNote,
  GetAdminNotesAndActionsVariables
} from 'queries/types/GetAdminNotesAndActions';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AnythingWrongSurvey } from 'components/Survey';
import { AppState } from 'reducers/rootReducer';

type NoteForm = {
  note: string;
};

function formatRFC3393Time(time: string): string {
  const parsed = DateTime.fromISO(time);
  return `${parsed.toLocaleString(
    DateTime.DATE_FULL
  )} at ${parsed.toLocaleString(DateTime.TIME_SIMPLE)}`;
}

const NoteListItem = ({
  note
}: {
  note: GetAdminNotesAndActionsSystemIntakeNote;
}) => {
  return (
    <li className="easi-grt__history-item">
      <div className="easi-grt__history-item-content">
        <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
          {note.content}
        </p>
        <span className="text-base-dark font-body-2xs">{`by: ${
          note.author.name
        } | ${formatRFC3393Time(note.createdAt)}`}</span>
      </div>
    </li>
  );
};

const ActionListItem = ({
  action
}: {
  action: GetAdminNotesAndActionsSystemIntakeAction;
}) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <li className="easi-grt__history-item">
      <div className="easi-grt__history-item-content">
        <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
          {t(`notes.actionName.${action.type}`)}
        </p>
        <span className="text-base-dark font-body-2xs display-block">
          {`by: ${action.actor.name} | ${formatRFC3393Time(action.createdAt)}}`}
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
  const { systemId } = useParams<{ systemId: string }>();
  const authState = useSelector((state: AppState) => state.auth);
  const [mutate, mutationResult] = useMutation<
    CreateSystemIntakeNote,
    CreateSystemIntakeNoteVariables
  >(CreateSystemIntakeNoteQuery);

  const { error, data, refetch } = useQuery<
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
        if (refetch) {
          // I was having an issue where sometimes refetch would be undefined.
          // This may be related to a bug in Apollo Client, so the check here is
          // to prevent that from breaking the app should it occur.
          refetch();
        }
      }
    });
  };

  const initialValues = {
    note: ''
  };

  const notesByTimestamp =
    data?.systemIntake?.notes.map(note => {
      return {
        createdAt: note.createdAt,
        element: <NoteListItem note={note} key={note.id} />
      };
    }) || [];

  const actionsByTimestamp =
    data?.systemIntake?.actions.map(action => {
      return {
        createdAt: action.createdAt,
        element: <ActionListItem action={action} key={action.id} />
      };
    }) || [];

  const interleavedList = [...notesByTimestamp, ...actionsByTimestamp]
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
    .map(a => a.element);

  return (
    <>
      <PageHeading>{t('notes.heading')}</PageHeading>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formikProps: FormikProps<NoteForm>) => {
          const { values } = formikProps;
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
              {error && (
                <Alert type="error">The notes could not be loaded.</Alert>
              )}
              {!error && data && (
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
