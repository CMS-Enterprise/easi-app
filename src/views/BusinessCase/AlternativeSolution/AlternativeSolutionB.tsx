import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { useFlags } from 'contexts/flagContext';
import { defaultProposedSolution } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import { putBusinessCase } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';
import BusinessCaseValidationSchema from 'validations/businessCaseSchema';

import AlternativeSolutionFields from './AlternativeSolutionFields';

type AlternativeSolutionBProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
};

const AlternativeSolutionB = ({
  businessCase,
  formikRef,
  dispatchSave
}: AlternativeSolutionBProps) => {
  const flags = useFlags();
  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = {
    alternativeB: businessCase.alternativeB
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={BusinessCaseValidationSchema.alternativeB}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<any>) => {
        const { errors, setErrors, validateForm } = formikProps;
        const values = formikProps.values.alternativeB;
        const flatErrors = flattenErrors(errors);
        return (
          <div className="grid-container">
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
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
            <h1 className="font-heading-xl">Alternatives Analysis</h1>
            <div className="tablet:grid-col-9">
              <div className="line-height-body-6">
                Some examples of options to consider may include:
                <ul className="padding-left-205 margin-y-0">
                  <li>Buy vs. build vs. lease vs. reuse of existing system</li>
                  <li>
                    Commercial off-the-shelf (COTS) vs. Government off-the-shelf
                    (GOTS)
                  </li>
                  <li>Mainframe vs. server-based vs. clustering vs. Cloud</li>
                </ul>
                <br />
                In your options, include details such as differences between
                system capabilities, user friendliness, technical and security
                considerations, ease and timing of integration with CMS&apos; IT
                infrastructure, etc.
              </div>
            </div>
            <div className="tablet:grid-col-5 margin-top-2 margin-bottom-5">
              <MandatoryFieldsAlert />
            </div>
            <Form>
              <div className="tablet:grid-col-9">
                <div className="easi-business-case__name-wrapper">
                  <h2 className="margin-0">Alternative B</h2>
                  <Button
                    type="button"
                    className="margin-left-2"
                    unstyled
                    onClick={() => {
                      if (
                        // eslint-disable-next-line no-alert
                        window.confirm(
                          'Are you sure you want to remove Alternative B?'
                        )
                      ) {
                        dispatch(
                          putBusinessCase({
                            ...businessCase,
                            alternativeB: defaultProposedSolution
                          })
                        );
                        history.replace(
                          `/business/${businessCase.id}/alternative-solution-a`
                        );
                        window.scrollTo(0, 0);
                      }
                    }}
                  >
                    Remove Alternative B
                  </Button>
                </div>

                <AlternativeSolutionFields
                  altLetter="B"
                  formikProps={formikProps}
                />
              </div>
            </Form>
            <Button
              type="button"
              outline
              onClick={() => {
                dispatchSave();
                setErrors({});
                const newUrl = 'alternative-solution-a';
                history.push(newUrl);
                window.scrollTo(0, 0);
              }}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                validateForm().then(err => {
                  if (Object.keys(err).length === 0) {
                    dispatchSave();
                    const newUrl = 'review';
                    history.push(newUrl);
                  }
                });
                window.scrollTo(0, 0);
              }}
            >
              Next
            </Button>
            <div className="margin-y-3">
              <Button
                type="button"
                unstyled
                onClick={() => {
                  dispatchSave();
                  history.push(
                    flags.taskListLite
                      ? `/governance-task-list/${businessCase.systemIntakeId}`
                      : '/'
                  );
                }}
              >
                <span>
                  <i className="fa fa-angle-left" /> Save & Exit
                </span>
              </Button>
            </div>
            <PageNumber currentPage={6} totalPages={6} />
            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 3}
            />
          </div>
        );
      }}
    </Formik>
  );
};

export default AlternativeSolutionB;
