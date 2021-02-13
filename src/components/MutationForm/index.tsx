/* eslint-disable react/prop-types */
import React, { FunctionComponent, useContext } from 'react';
import { DocumentNode, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import {
  Field as FormikField,
  Form as FormikForm,
  Formik,
  FormikProps
} from 'formik';
import * as yup from 'yup';

import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import flattenErrors from 'utils/flattenErrors';

const ErrorsContext = React.createContext<{ [key: string]: string }>({});

type FormProps = {
  mutation: DocumentNode;
  schema: any;
};

export const MutationForm: FunctionComponent<FormProps> = ({
  mutation,
  schema,
  children
}) => {
  const [mutate, mutationResult] = useMutation(mutation);
  return (
    <div className="margin-left-3">
      <Formik
        initialValues={schema.cast({})}
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
        {(formikProps: FormikProps<yup.TypeOf<typeof schema>>) => {
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
                <FormikForm>
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
                </FormikForm>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export const MutationField = ({
  name,
  label
}: {
  name: string;
  label: string;
}) => {
  const flatErrors = useContext(ErrorsContext);

  const id = `mutation-form-${name}`;

  return (
    <FieldGroup scrollElement={name} error={!!flatErrors[name]}>
      <Label htmlFor={id}>{label}</Label>
      <FieldErrorMsg>{flatErrors[name]}</FieldErrorMsg>
      <FormikField
        as={TextField}
        error={!!flatErrors[name]}
        id={id}
        maxLength={50}
        name={name}
      />
    </FieldGroup>
  );
};
