import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AutoSave from 'components/AutoSave';
import IconButton from 'components/IconButton';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { getSingleSolutionSchema } from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

import AlternativeSolutionFields from './AlternativeSolutionFields';

type AlternativeSolutionBProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
  isFinal: boolean;
};

const AlternativeSolutionB = ({
  businessCase,
  formikRef,
  dispatchSave,
  isFinal
}: AlternativeSolutionBProps) => {
  const { t } = useTranslation('businessCase');
  const history = useHistory();

  const initialValues = {
    alternativeB: businessCase.alternativeB
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={getSingleSolutionSchema(isFinal, 'Alternative B')}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<any>) => {
        const { values, errors, validateForm } = formikProps;
        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('alternativeB')}
            errors={flatErrors}
            data-testid="alternative-solution-b"
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
                {t('saveAndReturnToBusinessCase')}
              </IconButton>
              <AlternativeSolutionFields
                altLetter="B"
                businessCaseCreatedAt={businessCase.createdAt}
                formikProps={formikProps}
                isFinal={isFinal}
              />
            </Form>

            <hr
              className="margin-bottom-2 margin-top-4 opacity-30"
              aria-hidden
            />

            <Button
              type="button"
              onClick={() => {
                validateForm().then(err => {
                  if (Object.keys(err).length === 0) {
                    dispatchSave();
                    const newUrl = 'alternative-analysis';
                    history.push(newUrl);
                  } else {
                    window.scrollTo(0, 0);
                  }
                });
              }}
            >
              {t('Finish alternative B')}
            </Button>

            <IconButton
              type="button"
              icon={<Icon.ArrowBack />}
              className="margin-bottom-3 margin-top-2"
              data-testid="save-and-return-button"
              onClick={() => {
                dispatchSave();
                history.push(
                  `/business/${businessCase.systemIntakeId}/alternative-analysis`
                );
              }}
              unstyled
            >
              {t('saveAndReturnToBusinessCase')}
            </IconButton>

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

export default AlternativeSolutionB;
