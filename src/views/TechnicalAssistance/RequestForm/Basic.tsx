import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
// import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  CharacterCount,
  Checkbox,
  DatePicker,
  Dropdown,
  // ErrorMessage,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import { basicSchema } from 'validations/trbRequestSchema';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Basic({ request, stepUrl }: FormStepComponentProps) {
  // const history = useHistory();
  const { t } = useTranslation('technicalAssistance');

  const optionsText = t<any>('basic.options', {
    returnObjects: true
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [done, setDone] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(basicSchema),
    defaultValues: {
      requestName: request.name,
      requestComponent: 'Center for Medicaid and CHIP Services',
      whatTechnicalAssistance: 'what',
      doHaveSolution: 'true',
      describeSolution: 'solution',
      whereInProcess: 'I have an idea and want to brainstorm',
      solutionDate: 'true',
      expectedStartDate: '10/12/2022',
      expectedLiveDate: '10/13/2022'
      // selectOitGroups: ['']
    }
    /*
    defaultValues: {
      // testing
      requestName: request.name,
      // requestComponent: 'Center for Medicaid and CHIP Services',
      requestComponent: '',
      whatTechnicalAssistance: '',
      doHaveSolution: undefined,
      describeSolution: '',
      whereInProcess: undefined,
      solutionDate: undefined,
      expectedStartDate: '',
      expectedLiveDate: ''
      // selectOitGroups: ['']
    }
    */
  });

  console.log('values', watch());
  console.log('errors', errors);

  return (
    <Form
      className="trb-form-basic maxw-full"
      onSubmit={handleSubmit(data => {
        console.log('submit', data);
        // history.push(stepUrl.next);
      })}
    >
      <Grid row>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Alert type="info" slim>
            {t('basic.allFieldsMandatory')}
          </Alert>

          {/* Request name */}
          <Controller
            name="requestName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup className="margin-top-5" error={!!error}>
                <Label htmlFor="requestName" error={!!error}>
                  {t('basic.labels.requestName')}
                </Label>
                <TextInput
                  {...field}
                  ref={null}
                  id="requestName"
                  type="text"
                  validationStatus={error && 'error'}
                />
              </FormGroup>
            )}
          />

          {/* Request component */}
          <Controller
            name="requestComponent"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="requestComponent"
                  hint={<div>{t('basic.hint.requestComponent')}</div>}
                  error={!!error}
                >
                  {t('basic.labels.requestComponent')}
                </Label>
                <Dropdown id="requestComponent" {...field} ref={null}>
                  <option>- {t('basic.options.select')} -</option>
                  {cmsDivisionsAndOfficesOptions('requestComponent')}
                </Dropdown>
              </FormGroup>
            )}
          />

          {/* What do you need technical assistance with? */}
          <Controller
            name="whatTechnicalAssistance"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="whatTechnicalAssistance"
                  hint={<div>{t('basic.hint.whatTechnicalAssistance')}</div>}
                  error={!!error}
                >
                  {t('basic.labels.whatTechnicalAssistance')}
                </Label>
                <CharacterCount
                  {...field}
                  ref={null}
                  defaultValue={undefined}
                  id="whatTechnicalAssistance"
                  maxLength={2000}
                  isTextArea
                  rows={2}
                  aria-describedby="whatTechnicalAssistance-info whatTechnicalAssistance-hint"
                  error={!!error}
                />
              </FormGroup>
            )}
          />

          {/* Do you have a solution in mind already? */}
          <Controller
            name="doHaveSolution"
            control={control}
            render={({ field, fieldState: { error }, formState }) => {
              return (
                <FormGroup error={!!error}>
                  <Fieldset legend={t('basic.labels.doHaveSolution')}>
                    <Radio
                      {...field}
                      ref={null}
                      id="doHaveSolution-yes"
                      label={t('basic.options.yes')}
                      value="true"
                    />

                    {/* Describe your proposed solution */}
                    {field.value === 'true' && (
                      <Controller
                        name="describeSolution"
                        control={control}
                        // eslint-disable-next-line no-shadow
                        render={({ field, fieldState: { error } }) => (
                          <FormGroup error={!!error}>
                            <Label htmlFor="describeSolution" error={!!error}>
                              {t('basic.labels.describeSolution')}
                            </Label>
                            <CharacterCount
                              {...field}
                              ref={null}
                              defaultValue={undefined}
                              id="describeSolution"
                              maxLength={2000}
                              isTextArea
                              rows={2}
                              aria-describedby="describeSolution-info describeSolution-hint"
                              error={!!error}
                            />
                          </FormGroup>
                        )}
                      />
                    )}

                    <Radio
                      {...field}
                      ref={null}
                      id="doHaveSolution-no"
                      label={t('basic.options.no')}
                      value="false"
                    />
                  </Fieldset>
                </FormGroup>
              );
            }}
          />

          {/* Where are you in your process? */}
          <Controller
            name="whereInProcess"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="whereInProcess"
                  hint={t('basic.hint.whereInProcess')}
                  error={!!error}
                >
                  {t('basic.labels.whereInProcess')}
                </Label>
                <Dropdown id="whereInProcess" {...field} ref={null}>
                  <option> </option>
                  {Object.entries(optionsText.whereInProcess).map(([k, v]) => {
                    const val = v as string;
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </Dropdown>
              </FormGroup>
            )}
          />

          {/* Does your solution have an expected start and/or end date? */}
          <Controller
            name="solutionDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Fieldset legend={t('basic.labels.solutionDate')}>
                  <Radio
                    {...field}
                    ref={null}
                    id="solutionDate-yes"
                    value="true"
                    label={t('basic.options.yes')}
                  />

                  {field.value === 'true' && (
                    // <div className="margin-left-4 mobile-lg:display-flex">
                    <div className="margin-left-4">
                      {/* Expected start date */}
                      <Controller
                        name="expectedStartDate"
                        control={control}
                        // eslint-disable-next-line no-shadow
                        render={({ field, fieldState: { error } }) => (
                          <FormGroup error={!!error} className="flex-1">
                            <Label
                              htmlFor="expectedStartDate"
                              hint="mm/dd/yyyy"
                              error={!!error}
                            >
                              {t('basic.labels.expectedStartDate')}
                            </Label>
                            <DatePicker
                              id="expectedStartDate"
                              {...field}
                              ref={null}
                            />
                          </FormGroup>
                        )}
                      />
                      {/* Expected go live date */}
                      <Controller
                        name="expectedLiveDate"
                        control={control}
                        // eslint-disable-next-line no-shadow
                        render={({ field, fieldState: { error } }) => (
                          <FormGroup error={!!error}>
                            <Label
                              htmlFor="expectedLiveDate"
                              hint="mm/dd/yyyy"
                              error={!!error}
                            >
                              {t('basic.labels.expectedLiveDate')}
                            </Label>
                            <DatePicker
                              id="expectedLiveDate"
                              {...field}
                              ref={null}
                            />
                          </FormGroup>
                        )}
                      />
                    </div>
                  )}

                  <Radio
                    {...field}
                    ref={null}
                    id="solutionDate-no"
                    value="false"
                    label={t('basic.options.no')}
                  />
                </Fieldset>
              </FormGroup>
            )}
          />

          {/* Select any other OIT groups that you have met with or collaborated with. */}
          {false && (
            <Controller
              name="selectOitGroups"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormGroup error={!!error}>
                    <Fieldset legend={t('basic.labels.selectOitGroups')}>
                      {Object.entries(optionsText.selectOitGroups).map(
                        ([k, v]) => {
                          const val = v as string;
                          return (
                            <Checkbox
                              {...field}
                              ref={null}
                              key={k}
                              id={`selectOitGroups-${k}`}
                              label={val}
                              value={val}
                            />
                          );
                        }
                      )}
                    </Fieldset>
                  </FormGroup>
                );
              }}
            />
          )}

          {false && (
            <FormGroup>
              <Fieldset legend={t('basic.labels.selectOitGroups')}>
                <Checkbox
                  id="selectOitGroups-security"
                  test-id="selectOitGroups-security"
                  name="selectOitGroups-security"
                  label={optionsText.selectOitGroups.security}
                  value={optionsText.selectOitGroups.security}
                />
                {/* When did you meet with them? */}
                <FormGroup className="margin-left-4">
                  <Label
                    htmlFor="whenMeet"
                    hint={<div>{t('basic.hint.whenMeet')}</div>}
                  >
                    {t('basic.labels.whenMeet')}
                  </Label>
                  <TextInput
                    id="whenMeet"
                    name="whenMeet"
                    type="text"
                    placeholder="mm/dd/yyyy"
                  />
                </FormGroup>

                <Checkbox
                  id="selectOitGroups-ea"
                  test-id="selectOitGroups-ea"
                  name="selectOitGroups-ea"
                  label={optionsText.selectOitGroups.ea}
                  value={optionsText.selectOitGroups.ea}
                />
                <Checkbox
                  id="selectOitGroups-cloud"
                  test-id="selectOitGroups-cloud"
                  name="selectOitGroups-cloud"
                  label={optionsText.selectOitGroups.cloud}
                  value={optionsText.selectOitGroups.cloud}
                />
                <Checkbox
                  id="selectOitGroups-privacy"
                  test-id="selectOitGroups-privacy"
                  name="selectOitGroups-privacy"
                  label={optionsText.selectOitGroups.privacy}
                  value={optionsText.selectOitGroups.privacy}
                />
                <Checkbox
                  id="selectOitGroups-grbot"
                  test-id="selectOitGroups-grbot"
                  name="selectOitGroups-grbot"
                  label={optionsText.selectOitGroups.grbot}
                  value={optionsText.selectOitGroups.grbot}
                />

                <Checkbox
                  id="selectOitGroups-other"
                  test-id="selectOitGroups-other"
                  name="selectOitGroups-other"
                  label={optionsText.other}
                  value={optionsText.other}
                />
                {/* Which other group(s)? */}
                <FormGroup className="margin-left-4">
                  <Label htmlFor="whichGroups">
                    {t('basic.labels.whichGroups')}
                  </Label>
                  <TextInput id="whichGroups" name="whenMeet" type="text" />
                </FormGroup>
              </Fieldset>
            </FormGroup>
          )}
        </Grid>
      </Grid>

      <Pager
        className="margin-top-5"
        next={{
          disabled: !done
        }}
      />
    </Form>
  );
}

export default Basic;
