import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseFinalValidationSchema } from 'validations/businessCaseSchema';

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
  const history = useHistory();
  const { t } = useTranslation('businessCase');

  const initialValues = {
    alternativeB: businessCase.alternativeB
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={BusinessCaseFinalValidationSchema.alternativeB}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<any>) => {
        const { errors, validateForm } = formikProps;
        const values = formikProps.values.alternativeB;
        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('alternativeB')}
            errors={flatErrors}
            data-testid="alternative-solution-b"
          >
            <Alert
              type="info"
              slim
              role="alert"
              aria-live="polite"
              className="tablet:grid-col-8 margin-top-2"
            >
              {t('alternativesOptional')}
            </Alert>

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
                altLetter="B"
                businessCaseCreatedAt={businessCase.createdAt}
                formikProps={formikProps}
              />
            </Form>

            <Button
              type="button"
              onClick={() => {
                dispatchSave();
                const newUrl = 'alternative-analysis';

                // If final Business Case OR any field is filled
                if (
                  isFinal &&
                  alternativeSolutionHasFilledFields(
                    formikRef?.current?.values?.alternativeB
                  )
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
              {t('Finish Alternative B')}
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

            <PageNumber currentPage={6} totalPages={6} />

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
