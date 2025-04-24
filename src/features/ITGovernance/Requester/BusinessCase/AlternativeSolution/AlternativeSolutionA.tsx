import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import AutoSave from 'components/AutoSave';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseFinalValidationSchema } from 'validations/businessCaseSchema';

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
  const history = useHistory();
  const { t } = useTranslation('businessCase');

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
        const { errors, validateForm } = formikProps;
        const values = formikProps.values.alternativeA;

        const flatErrors = flattenErrors(errors);

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
              onClick={() => {
                dispatchSave();
                const newUrl = 'alternative-analysis';

                if (isFinal && alternativeSolutionHasFilledFields(values)) {
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
          </BusinessCaseStepWrapper>
        );
      }}
    </Formik>
  );
};

export default AlternativeSolutionA;
