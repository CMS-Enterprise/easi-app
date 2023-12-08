import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import IconButton from 'components/shared/IconButton';
import TextAreaField from 'components/shared/TextAreaField';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel, RequestDescriptionForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import {
  BusinessCaseDraftValidationSchema,
  BusinessCaseFinalValidationSchema
} from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

type RequestDescriptionProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
  isFinal: boolean;
};

const RequestDescription = ({
  businessCase,
  formikRef,
  dispatchSave,
  isFinal
}: RequestDescriptionProps) => {
  const { t } = useTranslation('businessCase');
  const history = useHistory();

  const initialValues = {
    businessNeed: businessCase.businessNeed,
    currentSolutionSummary: businessCase.currentSolutionSummary,
    cmsBenefit: businessCase.cmsBenefit,
    priorityAlignment: businessCase.priorityAlignment,
    successIndicators: businessCase.successIndicators
  };

  const ValidationSchema =
    businessCase.systemIntakeStatus === 'BIZ_CASE_FINAL_NEEDED'
      ? BusinessCaseFinalValidationSchema
      : BusinessCaseDraftValidationSchema;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={ValidationSchema.requestDescription}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<RequestDescriptionForm>) => {
        const { values, errors, setErrors, validateForm } = formikProps;
        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('requestDescription')}
            data-testid="request-description"
            errors={flatErrors}
            fieldsMandatory={isFinal}
            isFinal={isFinal}
          >
            <Form className="tablet:grid-col-9 margin-bottom-6">
              <FieldGroup
                scrollElement="businessNeed"
                error={!!flatErrors.businessNeed}
              >
                <Label htmlFor="BusinessCase-BusinessNeed">
                  {t('businessNeed.label')}
                </Label>
                <HelpText
                  id="BusinessCase-BusinessNeedHelp"
                  className="margin-top-1"
                >
                  {t('businessNeed.include')}
                  <ul className="margin-top-1 padding-left-205">
                    <li>{t('businessNeed.explanation')}</li>
                    <li>{t('businessNeed.mandates')}</li>
                    <li>{t('businessNeed.investmentBenefits')}</li>
                    <li>{t('businessNeed.deadlines')}</li>
                    <li>{t('businessNeed.solutionBenefits')}</li>
                  </ul>
                </HelpText>
                <FieldErrorMsg>{flatErrors.businessNeed}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.businessNeed}
                  id="BusinessCase-BusinessNeed"
                  maxLength={2000}
                  name="businessNeed"
                  aria-describedby="BusinessCase-BusinessNeedCounter BusinessCase-BusinessNeedHelp"
                />
              </FieldGroup>

              <FieldGroup
                scrollElement="currentSolutionSummary"
                error={!!flatErrors.currentSolutionSummary}
              >
                <Label htmlFor="BusinessCase-CurrentSolutionSummary">
                  {t('currentSolutionSummary')}
                </Label>
                <HelpText
                  id="BusinessCase-CurrentSolutionSummaryHelp"
                  className="margin-top-1"
                >
                  {t('currentSolutionSummaryHelpText')}
                </HelpText>
                <FieldErrorMsg>
                  {flatErrors.currentSolutionSummary}
                </FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.currentSolutionSummary}
                  id="BusinessCase-CurrentSolutionSummary"
                  maxLength={2000}
                  name="currentSolutionSummary"
                  aria-describedby="BusinessCase-CurrentSolutionSummaryCounter BusinessCase-CurrentSolutionSummaryHelp"
                />
              </FieldGroup>

              <FieldGroup
                scrollElement="cmsBenefit"
                error={!!flatErrors.cmsBenefit}
              >
                <Label htmlFor="BusinessCase-CmsBenefit">
                  {t('cmsBenefit')}
                </Label>
                <HelpText
                  id="BusinessCase-CmsBenefitHelp"
                  className="margin-top-1"
                >
                  {t('cmsBenefitHelpText')}
                </HelpText>
                <FieldErrorMsg>{flatErrors.cmsBenefit}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.cmsBenefit}
                  id="BusinessCase-CmsBenefit"
                  maxLength={2000}
                  name="cmsBenefit"
                  aria-describedby="BusinessCase-CmsBenefitCounter BusinessCase-CmsBenefitHelp"
                />
              </FieldGroup>

              <FieldGroup
                scrollElement="priorityAlignment"
                error={!!flatErrors.priorityAlignment}
              >
                <Label htmlFor="BusinessCase-PriorityAlignment">
                  {t('priorityAlignment')}
                </Label>
                <HelpText
                  id="BusinessCase-PriorityAlignmentHelp"
                  className="margin-top-1"
                >
                  {t('priorityAlignmentHelpText')}
                </HelpText>
                <FieldErrorMsg>{flatErrors.priorityAlignment}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.priorityAlignment}
                  id="BusinessCase-PriorityAlignment"
                  maxLength={2000}
                  name="priorityAlignment"
                  aria-describedby="BusinessCase-PriorityAlignmentCounter BusinessCase-PriorityAlignmentHelp"
                />
              </FieldGroup>

              <FieldGroup
                scrollElement="successIndicators"
                error={!!flatErrors.successIndicators}
              >
                <Label htmlFor="BusinessCase-SuccessIndicators">
                  {t('successIndicators')}
                </Label>
                <HelpText
                  id="BusinessCase-SuccessIndicatorsHelp"
                  className="margin-top-1"
                >
                  {t('successIndicatorsHelpText')}
                </HelpText>
                <FieldErrorMsg>{flatErrors.successIndicators}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.successIndicators}
                  id="BusinessCase-SuccessIndicators"
                  maxLength={2000}
                  name="successIndicators"
                  aria-describedby="BusinessCase-SuccessIndicatorsCounter BusinessCase-SuccessIndicatorsHelp"
                />
              </FieldGroup>
            </Form>

            <ButtonGroup>
              <Button
                type="button"
                outline
                onClick={() => {
                  dispatchSave();
                  setErrors({});
                  const newUrl = 'general-request-info';
                  history.push(newUrl);
                }}
              >
                {t('Back')}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  validateForm().then(err => {
                    if (Object.keys(err).length === 0) {
                      dispatchSave();
                      const newUrl = 'preferred-solution';
                      history.push(newUrl);
                    } else {
                      window.scrollTo(0, 0);
                    }
                  });
                }}
              >
                {t('Next')}
              </Button>
            </ButtonGroup>

            <IconButton
              type="button"
              icon={<IconArrowBack />}
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
              currentPage={2}
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

export default RequestDescription;
