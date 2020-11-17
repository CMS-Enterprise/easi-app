import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';

import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { AppState } from 'reducers/rootReducer';
import { postIntakeNote } from 'types/routines';

type NoteForm = {
  note: string;
};

const Notes = () => {
  const dispatch = useDispatch();
  const { systemId } = useParams<{ systemId: string }>();
  const authState = useSelector((state: AppState) => state.auth);
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

  const initialValues = {
    note: ''
  };

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
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Notes;
