/* eslint-disable react/prop-types */
import React, { FunctionComponent, useContext } from 'react';
import { DocumentNode, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import CreateAccessibilityRequest from 'queries/CreateAccessibilityRequestQuery';
import * as yup from 'yup';
import { TypeOf } from 'yup';

import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import flattenErrors from 'utils/flattenErrors';

const ErrorsContext = React.createContext<{ [key: string]: string }>({});

type MutationFormProps = {
  mutation: DocumentNode;
  schema: any;
};

const MutationForm: FunctionComponent<MutationFormProps> = ({
  mutation,
  schema,
  children
}) => {
  const [mutate, mutationResult] = useMutation(mutation);
  return (
    <div className="margin-left-3">
      <Formik
        initialValues={{ name: '' }}
        onSubmit={values => {
          mutate({
            variables: { input: values }
          });
        }}
        validationSchema={schema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {(formikProps: FormikProps<TypeOf<typeof schema>>) => {
          const { handleSubmit, errors } = formikProps;
          const flatErrors = flattenErrors(errors);
          return (
            <>
              {Object.keys(errors).length > 0 && (
                <ErrorAlert
                  testId="form-errors"
                  classNames="margin-top-3"
                  heading="Please check and fix the following"
                >
                  {Object.keys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={key}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}

              {mutationResult.error && (
                <ErrorAlert heading="System error">
                  <ErrorAlertMessage
                    message={mutationResult.error.message}
                    errorKey="system"
                  />
                </ErrorAlert>
              )}
              <p className="line-height-body-5">Create Accessibility Request</p>

              <div className="tablet:grid-col-6 margin-bottom-7">
                <Form>
                  <ErrorsContext.Provider value={flatErrors}>
                    {children}
                  </ErrorsContext.Provider>

                  <div className="margin-y-3">
                    <Button
                      type="button"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      <span>Save</span>
                    </Button>
                  </div>
                </Form>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

const MutationFormField = ({ name }: { name: string }) => {
  const flatErrors = useContext(ErrorsContext);

  return (
    <FieldGroup scrollElement={name} error={!!flatErrors[name]}>
      <Label htmlFor="IntakeForm-Requester">Name</Label>
      <FieldErrorMsg>{flatErrors[name]}</FieldErrorMsg>
      <Field
        as={TextField}
        error={!!flatErrors[name]}
        id="Name"
        maxLength={50}
        name={name}
      />
    </FieldGroup>
  );
};

const CreateAccessibilityRequestFormSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Enter a name for this request')
});

const Create = () => {
  return (
    <div className="margin-left-3">
      <MutationForm
        mutation={CreateAccessibilityRequest}
        schema={CreateAccessibilityRequestFormSchema}
      >
        <MutationFormField name="name" />
      </MutationForm>
    </div>
  );
};

export default Create;
