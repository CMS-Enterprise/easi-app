import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';

import AutoSave from 'components/AutoSave';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import { solutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseSchema } from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

import AlternativeSolutionFields from './AlternativeSolutionFields';

type AlternativeSolutionProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
  isFinal: boolean;
};

const AlternativeSolutionA = ({
  businessCase,
  formikRef,
  dispatchSave,
  isFinal
}: AlternativeSolutionProps) => {
  const { t } = useTranslation('businessCase');
  const history = useHistory();

  const initialValues = {
    alternativeA: businessCase.alternativeA
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={BusinessCaseSchema(isFinal).alternativeA}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<any>) => {
        const { values, errors } = formikProps;

        const flatErrors = flattenErrors(errors);

        const validateSolution = () => {
          try {
            BusinessCaseSchema(isFinal).alternativeA.validateSync(
              values.alternativeA,
              { abortEarly: false }
            );

            return true;
          } catch (err) {
            return false;
          }
        };

        const isFormValid = validateSolution();

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('alternativeA')}
            errors={flatErrors}
            data-testid="alternative-solution-a"
          >
            <Form>
              <IconButton
                type="button"
                icon={<Icon.ArrowBack />}
                className="margin-bottom-3 margin-top-2"
                onClick={() => {
                  dispatchSave();
                  history.push(
                    `/business/${businessCase.systemIntakeId}/alternative-analysis`
                  );
                }}
                unstyled
              >
                {t('Save & return to Business Case')}
              </IconButton>

              <AlternativeSolutionFields
                altLetter="A"
                businessCaseCreatedAt={businessCase.createdAt}
                formikProps={formikProps}
              />
            </Form>

            <Button
              type="button"
              disabled={!isFormValid}
              className={classnames('usa-button', {
                'no-pointer': !isFormValid
              })}
              // onClick={() => {
              //   validateForm().then(err => {
              //     if (Object.keys(err).length === 0) {
              //       dispatchSave();
              //       const newUrl = 'alternative-analysis';
              //       history.push(newUrl);
              //     } else {
              //       window.scrollTo(0, 0);
              //     }
              //   });
              // }}

              // TODO: NJD - I couldn't get valdiation to work properly here - I don't think we need it since we validate on the actual button
              //    but I would like to get it working to be safe. Any suggestions on how to get the above validation working onClick? It
              //    has something to do with Promises. I could probably call the BusinessCaseSchema directly like i do in isFormValid?
              onClick={() => {
                dispatchSave();
                const newUrl = 'alternative-analysis';
                history.push(newUrl);
              }}
            >
              {t('Finish Alternative A')}
            </Button>

            <IconButton
              type="button"
              icon={<Icon.ArrowBack />}
              className="margin-bottom-3 margin-top-2"
              onClick={() => {
                dispatchSave();
                history.push(
                  `/business/${businessCase.systemIntakeId}/alternative-analysis`
                );
              }}
              unstyled
            >
              {t('Save & return to Business Case')}
            </IconButton>

            <PageNumber
              currentPage={5}
              totalPages={
                solutionHasFilledFields(businessCase.alternativeB) ? 6 : 5
              }
            />
            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 3}
            />
          </BusinessCaseStepWrapper>
        );
      }}
    </Formik>
  );
};

export default AlternativeSolutionA;
