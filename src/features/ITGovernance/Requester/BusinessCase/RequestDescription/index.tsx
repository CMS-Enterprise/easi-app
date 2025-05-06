import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Icon, Label } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import CollapsableLink from 'components/CollapsableLink';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TextAreaField from 'components/TextAreaField';
import { BusinessCaseModel, RequestDescriptionForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseSchema } from 'validations/businessCaseSchema';

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

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={BusinessCaseSchema(isFinal).requestDescription}
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
          >
            <Form className="tablet:grid-col-9 margin-bottom-6">
              {/* Required fields help text and alert */}
              <HelpText className="margin-top-1 text-base">
                <Trans
                  i18nKey="businessCase:requiredFields"
                  components={{ red: <span className="text-red" /> }}
                />
              </HelpText>

              {!isFinal && (
                <Alert type="info" className="margin-top-2" slim>
                  {t('businessCase:draftAlert')}
                </Alert>
              )}

              <FieldGroup
                scrollElement="businessNeed"
                error={!!flatErrors.businessNeed}
              >
                <Label
                  htmlFor="BusinessCase-BusinessNeed"
                  className="width-100"
                >
                  {t('businessNeed.label')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-BusinessNeedHelp"
                  className="margin-top-1"
                >
                  {t('businessNeed.include')}
                  <ul className="margin-top-1 padding-left-205">
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
              {/* TODO: add internal collaboration question */}
              <FieldGroup
                scrollElement="currentSolutionSummary"
                error={!!flatErrors.currentSolutionSummary}
              >
                <Label htmlFor="BusinessCase-CurrentSolutionSummary">
                  {t('currentSolutionSummary')}
                  <RequiredAsterisk />
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
                  <RequiredAsterisk />
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
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-PriorityAlignmentHelp"
                  className="margin-top-1"
                >
                  {t('priorityAlignmentHelpText')}
                </HelpText>
                <CollapsableLink
                  id="BusinessCase-examplePriorityAlignment"
                  label={t('priorityAlignmentExample.label')}
                  className="margin-top-1 margin-bottom-2"
                >
                  {t('priorityAlignmentExample.description')}
                </CollapsableLink>
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
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-SuccessIndicatorsHelp"
                  className="margin-top-1"
                >
                  {t('successIndicatorsHelpText')}
                </HelpText>
                <CollapsableLink
                  id="BusinessCase-exampleSuccessIndicators"
                  label={t('successIndicatorsExamples.label')}
                  className="margin-top-1 margin-bottom-2"
                >
                  {t('successIndicatorsExamples.description')}
                </CollapsableLink>
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
              {/* TODO: add response to GRT recs question */}
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
                      const newUrl = 'alternative-analysis';
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

            <PageNumber currentPage={2} totalPages={5} />

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
