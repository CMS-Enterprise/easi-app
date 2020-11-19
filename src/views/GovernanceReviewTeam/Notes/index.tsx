import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AppState } from 'reducers/rootReducer';
import { fetchIntakeNotes, postIntakeNote } from 'types/routines';
import { IntakeNote } from 'types/systemIntake';

type NoteForm = {
  note: string;
};

const Notes = () => {
  const dispatch = useDispatch();
  const { systemId } = useParams<{ systemId: string }>();
  const authState = useSelector((state: AppState) => state.auth);
  const notes = useSelector((state: AppState) => state.systemIntake.notes);

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
    await resetForm();
  };

  useEffect(() => {
    dispatch(fetchIntakeNotes(systemId));
  }, [dispatch, systemId]);

  const initialValues = {
    note: ''
  };

  const sortedNotes = notes.sort(
    (a: IntakeNote, b: IntakeNote) =>
      b.createdAt.toMillis() - a.createdAt.toMillis()
  );

  return (
    <>
      <h1>{t('notes.heading')}</h1>
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
              <ul className="easi-grt__note-list">
                {sortedNotes.map((note: IntakeNote) => {
                  return (
                    <li className="easi-grt__note" key={note.id}>
                      <div className="easi-grt__note-content">
                        <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
                          {note.content}
                        </p>
                        <span className="text-base-dark font-body-2xs">{`by: ${
                          note.authorName
                        } | ${note.createdAt.toLocaleString(
                          DateTime.DATE_FULL
                        )} at ${note.createdAt.toLocaleString(
                          DateTime.TIME_SIMPLE
                        )}`}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Notes;
