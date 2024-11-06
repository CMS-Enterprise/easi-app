import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import HelpText from 'components/shared/HelpText';
import IconButton from 'components/shared/IconButton';
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
        const { errors, setErrors, validateForm } = formikProps;
        const values = formikProps.values.alternativeA;

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
            data-testid="alternative-solution-a"
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
              <h2 className="margin-y-4">{t('alternativeA')}</h2>

              <AlternativeSolutionFields
                altLetter="A"
                businessCaseCreatedAt={businessCase.createdAt}
                formikProps={formikProps}
              />

              {!alternativeSolutionHasFilledFields(
                businessCase.alternativeB
              ) && (
                <div className="margin-bottom-6 tablet:grid-col-9">
                  <h2 className="margin-bottom-1">
                    {t('additionalAlternatives')}
                  </h2>
                  <HelpText>{t('additionalAlternativesHelpText')}</HelpText>
                  <IconButton
                    type="button"
                    icon={<Icon.Add />}
                    className="margin-top-2"
                    onClick={() => {
                      if (
                        isFinal &&
                        alternativeSolutionHasFilledFields(values)
                      ) {
                        validateForm().then(err => {
                          if (Object.keys(err).length === 0) {
                            dispatchSave();
                            history.push('alternative-solution-b');
                          } else {
                            window.scrollTo(0, 0);
                          }
                        });
                      } else {
                        history.push('alternative-solution-b');
                      }
                    }}
                    base
                  >
                    {t('alternativeB')}
                  </IconButton>
                </div>
              )}
            </Form>

            <ButtonGroup>
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
                {t('Back')}
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
                {t('Next')}
              </Button>
            </ButtonGroup>

            <IconButton
              type="button"
              icon={<Icon.ArrowBack />}
              className="margin-bottom-3 margin-top-2"
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
