import React from 'react';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';

const Notes = () => {
  const onSubmit = () => {};

  const initialValues = {
    note: ''
  };

  return (
    <>
      <h1>Admin team notes</h1>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formikProps: FormikProps<any>) => {
          const { values } = formikProps;
          return (
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup>
                  <Label htmlFor="GovernanceReviewTeam-Note">Add a note</Label>
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
                  Add note
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
