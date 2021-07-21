import React from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Button } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import HelpText from 'components/shared/HelpText';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseFinalValidationSchema } from 'validations/businessCaseSchema';

import AlternativeSolutionFields from './AlternativeSolutionFields';

type AlternativeSolutionProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
};

const AlternativeSolutionA = ({
  businessCase,
  formikRef,
  dispatchSave
}: AlternativeSolutionProps) => {
  const history = useHistory();
  const initialValues = {
    alternativeA: businessCase.alternativeA
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={BusinessCaseFinalValidationSchema.alternativeA}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<any>) => {
        const { errors, setErrors, validateForm } = formikProps;
        const values = formikProps.values.alternativeA;

        const flatErrors = flattenErrors(errors);
        return (
          <div className="grid-container" data-testid="alternative-solution-a">
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="formik-validation-errors"
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
            <PageHeading>Alternatives Analysis</PageHeading>
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
            <div className="tablet:grid-col-8 margin-top-2">
              <Alert type="info" slim role="alert" aria-live="polite">
                This section is optional. You can skip it if you don&apos;t have
                any alternative solutions.
              </Alert>
            </div>
            <Form>
              <div className="tablet:grid-col-9">
                <h2 className="margin-y-4">Alternative A</h2>
                <AlternativeSolutionFields
                  altLetter="A"
                  businessCaseCreatedAt={businessCase.createdAt}
                  formikProps={formikProps}
                />

                {!alternativeSolutionHasFilledFields(
                  businessCase.alternativeB
                ) && (
                  <div className="margin-bottom-7">
                    <h2 className="margin-bottom-1">Additional alternatives</h2>
                    <HelpText>
                      If you are buillding a multi-year project that will
                      require significant upkeep, you may want to include more
                      alternatives. Keep in mind that Government off-the-shelf
                      and Commercial off-the-shelf products are acceptable
                      alternatives to include.
                    </HelpText>
                    <div className="margin-top-2">
                      <Button
                        type="button"
                        base
                        onClick={() => {
                          dispatchSave();
                          history.push('alternative-solution-b');
                        }}
                      >
                        + Alternative B
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Form>
            <Button
              type="button"
              outline
              onClick={() => {
                dispatchSave();
                setErrors({});
                const newUrl = 'preferred-solution';
                history.push(newUrl);
              }}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                dispatchSave();
                const newUrl = alternativeSolutionHasFilledFields(
                  businessCase.alternativeB
                )
                  ? 'alternative-solution-b'
                  : 'review';
                if (
                  businessCase.systemIntakeStatus === 'BIZ_CASE_FINAL_NEEDED' &&
                  alternativeSolutionHasFilledFields(values)
                ) {
                  validateForm().then(err => {
                    if (Object.keys(err).length === 0) {
                      history.push(newUrl);
                    } else {
                      window.scrollTo(0, 0);
                    }
                  });
                } else {
                  history.push(newUrl);
                }
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
                    `/governance-task-list/${businessCase.systemIntakeId}`
                  );
                }}
              >
                <span>
                  <i className="fa fa-angle-left" /> Save & Exit
                </span>
              </Button>
            </div>
            <PageNumber
              currentPage={5}
              totalPages={
                alternativeSolutionHasFilledFields(businessCase.alternativeB)
                  ? 6
                  : 5
              }
            />
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

export default AlternativeSolutionA;
