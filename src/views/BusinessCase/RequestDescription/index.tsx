import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  IconNavigateBefore,
  Label,
  Textarea
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel, RequestDescriptionForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { isBusinessCaseFinal } from 'utils/systemIntake';
import {
  BusinessCaseDraftValidationSchema,
  BusinessCaseFinalValidationSchema
} from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

type RequestDescriptionProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
};

const RequestDescription = ({
  businessCase,
  formikRef,
  dispatchSave
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

        // TODO EASI-3440: Update to use v2 status
        const isFinal = isBusinessCaseFinal(businessCase.systemIntakeStatus);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('requestDescription')}
            data-testid="request-description"
            errors={flatErrors}
            fieldsMandatory={isFinal}
            isFinal={isFinal}
          >
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup
                  scrollElement="businessNeed"
                  error={!!flatErrors.businessNeed}
                >
                  <Label htmlFor="BusinessCase-BusinessNeed">
                    What is your business or user need?
                  </Label>
                  <HelpText
                    id="BusinessCase-BusinessNeedHelp"
                    className="margin-y-1"
                  >
                    <span>Include:</span>
                    <ul className="margin-top-1 padding-left-205">
                      <li>
                        a detailed explanation of the business
                        need/issue/problem that the request will address
                      </li>
                      <li>
                        any legislative mandates or regulations that needs to be
                        met
                      </li>
                      <li>
                        any expected benefits from the investment of
                        organizational resources into the request
                      </li>
                      <li>
                        relevant deadlines (e.g., statutory deadlines that CMS
                        must meet)
                      </li>
                      <li>
                        and the benefits of developing an IT solution for this
                        need
                      </li>
                    </ul>
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.businessNeed}</FieldErrorMsg>
                  <Field
                    as={Textarea}
                    error={!!flatErrors.businessNeed}
                    id="BusinessCase-BusinessNeed"
                    maxLength={2000}
                    name="businessNeed"
                    aria-describedby="BusinessCase-BusinessNeedCounter BusinessCase-BusinessNeedHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-BusinessNeedCounter"
                    characterCount={2000 - values.businessNeed.length}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="currentSolutionSummary"
                  error={!!flatErrors.currentSolutionSummary}
                >
                  <Label htmlFor="BusinessCase-CurrentSolutionSummary">
                    Summary of Current Solution
                  </Label>
                  <HelpText
                    id="BusinessCase-CurrentSolutionSummaryHelp"
                    className="margin-top-1"
                  >
                    Provide a brief summary of the solution currently in place
                    including any associated software products and costs (e.g.
                    services, software, Operation and Maintenance)
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors.currentSolutionSummary}
                  </FieldErrorMsg>
                  <Field
                    as={Textarea}
                    error={!!flatErrors.currentSolutionSummary}
                    id="BusinessCase-CurrentSolutionSummary"
                    maxLength={2000}
                    name="currentSolutionSummary"
                    aria-describedby="BusinessCase-CurrentSolutionSummaryCounter BusinessCase-CurrentSolutionSummaryHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-CurrentSolutionSummaryCounter"
                    characterCount={2000 - values.currentSolutionSummary.length}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="cmsBenefit"
                  error={!!flatErrors.cmsBenefit}
                >
                  <Label htmlFor="BusinessCase-CmsBenefit">
                    How will CMS benefit from this effort?
                  </Label>
                  <HelpText
                    id="BusinessCase-CmsBenefitHelp"
                    className="margin-y-1"
                  >
                    Provide a summary of how this effort benefits CMS. Include
                    any information on how it supports CMS&apos; mission and
                    strategic goals, creates efficiencies and/or cost savings,
                    or reduces risk
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.cmsBenefit}</FieldErrorMsg>
                  <Field
                    as={Textarea}
                    error={!!flatErrors.cmsBenefit}
                    id="BusinessCase-CmsBenefit"
                    maxLength={2000}
                    name="cmsBenefit"
                    aria-describedby="BusinessCase-CmsBenefitCounter BusinessCase-CmsBenefitHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-CmsBenefitCounter"
                    characterCount={2000 - values.cmsBenefit.length}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="priorityAlignment"
                  error={!!flatErrors.priorityAlignment}
                >
                  <Label htmlFor="BusinessCase-PriorityAlignment">
                    How does this effort align with organizational priorities?
                  </Label>
                  <HelpText
                    id="BusinessCase-PriorityAlignmentHelp"
                    className="margin-y-1"
                  >
                    List out any administrator priorities or new
                    legislative/regulatory mandates this effort supports. If
                    applicable, include any relevant deadlines
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.priorityAlignment}</FieldErrorMsg>
                  <Field
                    as={Textarea}
                    error={!!flatErrors.priorityAlignment}
                    id="BusinessCase-PriorityAlignment"
                    maxLength={2000}
                    name="priorityAlignment"
                    aria-describedby="BusinessCase-PriorityAlignmentCounter BusinessCase-PriorityAlignmentHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-PriorityAlignmentCounter"
                    characterCount={2000 - values.priorityAlignment.length}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="successIndicators"
                  error={!!flatErrors.successIndicators}
                >
                  <Label htmlFor="BusinessCase-SuccessIndicators">
                    How will you determine whether or not this effort is
                    successful?
                  </Label>
                  <HelpText
                    id="BusinessCase-SuccessIndicatorsHelp"
                    className="margin-y-1"
                  >
                    Include any indicators that you think would demonstrate
                    success
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.successIndicators}</FieldErrorMsg>
                  <Field
                    as={Textarea}
                    error={!!flatErrors.successIndicators}
                    id="BusinessCase-SuccessIndicators"
                    maxLength={2000}
                    name="successIndicators"
                    aria-describedby="BusinessCase-SuccessIndicatorsCounter BusinessCase-SuccessIndicatorsHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-SuccessIndicatorsCounter"
                    characterCount={2000 - values.successIndicators.length}
                  />
                </FieldGroup>
              </Form>
            </div>
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
              Back
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
                <span className="display-flex flex-align-center">
                  <IconNavigateBefore /> Save & Exit
                </span>
              </Button>
            </div>
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
