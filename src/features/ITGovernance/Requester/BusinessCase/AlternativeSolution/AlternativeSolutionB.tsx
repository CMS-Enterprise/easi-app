import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import {
  alternativeSolutionHasFilledFields,
  defaultProposedSolution
} from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import { putBusinessCase } from 'types/routines';
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
  const dispatch = useDispatch();
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
        const { errors, setErrors, validateForm } = formikProps;
        const values = formikProps.values.alternativeB;
        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('alternatives')}
            description={
              <>
                <p>{t('alternativesDescription.text.0')}</p>
                <p className="margin-bottom-0">
                  {t('alternativesDescription.text.1')}
                </p>
                <ul className="padding-left-205 margin-top-0">
                  <li>{t('alternativesDescription.list.0')}</li>
                  <li>{t('alternativesDescription.list.1')}</li>
                  <li>{t('alternativesDescription.list.2')}</li>
                  <li>{t('alternativesDescription.list.3')}</li>
                  <li>{t('alternativesDescription.list.4')}</li>
                </ul>
                <p>{t('alternativesDescription.text.2')}</p>
              </>
            }
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
              <div className="easi-business-case__name-wrapper tablet:grid-col-9">
                <h2 className="margin-0">{t('alternativeB')}</h2>
                <Button
                  type="button"
                  className="margin-left-2"
                  unstyled
                  onClick={() => {
                    if (
                      // eslint-disable-next-line no-alert
                      window.confirm(t('confirmRemoveAlternativeB'))
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
                    }
                  }}
                >
                  {t('removeAlternativeB')}
                </Button>
              </div>

              <AlternativeSolutionFields
                altLetter="B"
                businessCaseCreatedAt={businessCase.createdAt}
                formikProps={formikProps}
              />
            </Form>

            <ButtonGroup>
              <Button
                type="button"
                outline
                onClick={() => {
                  dispatchSave();
                  setErrors({});
                  const newUrl = 'alternative-solution-a';
                  history.push(newUrl);
                }}
              >
                {t('Back')}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  dispatchSave();
                  // If final Business Case OR any field is filled
                  if (
                    isFinal &&
                    alternativeSolutionHasFilledFields(
                      formikRef?.current?.values?.alternativeB
                    )
                  ) {
                    validateForm().then(err => {
                      if (Object.keys(err).length === 0) {
                        history.push('review');
                      } else {
                        window.scrollTo(0, 0);
                      }
                    });
                  } else {
                    history.push('review');
                  }
                }}
              >
                {t('Next')}
              </Button>
            </ButtonGroup>

            <IconButton
              type="button"
              icon={<Icon.ArrowBack />}
              className="margin-top-2 margin-bottom-3"
              onClick={() => {
                dispatchSave();
                history.push(
                  `/governance-task-list/${businessCase.systemIntakeId}`
                );
              }}
              unstyled
            >
              {t('Save & Exit')}
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
