import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Alert,
  CharacterCount,
  Checkbox,
  DatePicker,
  Dropdown,
  ErrorMessage,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Basic({ request, stepUrl }: FormStepComponentProps) {
  const history = useHistory();
  const { t } = useTranslation('technicalAssistance');

  const optionsText = t<any>('basic.options', {
    returnObjects: true
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [done, setDone] = useState<boolean>(true);

  return (
    <Grid row className="trb-form-basic">
      <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
        <Form
          className="maxw-full"
          onSubmit={() => {
            history.push(stepUrl.next);
          }}
        >
          <Alert type="info" slim>
            {t('basic.allFieldsMandatory')}
          </Alert>

          {/* Request name */}
          <FormGroup error className="margin-top-5">
            <Label htmlFor="requestName" error>
              {t('basic.labels.requestName')}
            </Label>
            <ErrorMessage>Helpful error message</ErrorMessage>
            <TextInput
              id="requestName"
              name="requestName"
              type="text"
              value={request.name}
              validationStatus="error"
            />
          </FormGroup>

          {/* Request component */}
          <FormGroup>
            <Label
              htmlFor="requestComponent"
              hint={<div>{t('basic.hint.requestComponent')}</div>}
            >
              {t('basic.labels.requestComponent')}
            </Label>
            <Dropdown id="requestComponent" name="requestComponent">
              <option>- {t('basic.options.select')} -</option>
              {cmsDivisionsAndOfficesOptions('requestComponent')}
            </Dropdown>
          </FormGroup>

          {/* What do you need technical assistance with? */}
          <FormGroup>
            <Label
              htmlFor="whatTechnicalAssistance"
              hint={<div>{t('basic.hint.whatTechnicalAssistance')}</div>}
            >
              {t('basic.labels.whatTechnicalAssistance')}
            </Label>
            <CharacterCount
              id="whatTechnicalAssistance"
              name="whatTechnicalAssistance"
              maxLength={2000}
              isTextArea
              rows={2}
              aria-describedby="whatTechnicalAssistance-info whatTechnicalAssistance-hint"
            />
          </FormGroup>

          {/* Do you have a solution in mind already? */}
          <FormGroup>
            <Fieldset legend={t('basic.labels.doHaveSolution')}>
              {/* ErrorMessage */}
              <Radio
                id="doHaveSolution-yes"
                name="doHaveSolution"
                value="true"
                label={t('basic.options.yes')}
              />

              {/* Describe your proposed solution */}
              <FormGroup className="margin-left-4">
                <Label htmlFor="describeSolution">
                  {t('basic.labels.describeSolution')}
                </Label>
                {/* ErrorMessage */}
                <CharacterCount
                  id="describeSolution"
                  name="describeSolution"
                  maxLength={2000}
                  isTextArea
                  rows={2}
                  aria-describedby="describeSolution-info describeSolution-hint"
                />
              </FormGroup>

              <Radio
                id="doHaveSolution-no"
                name="doHaveSolution"
                value="false"
                label={t('basic.options.no')}
              />
            </Fieldset>
          </FormGroup>

          {/* Where are you in your process? */}
          <FormGroup>
            <Label
              htmlFor="whereInProcess"
              hint={<div>{t('basic.hint.whereInProcess')}</div>}
            >
              {t('basic.labels.whereInProcess')}
            </Label>
            <Dropdown id="whereInProcess" name="whereInProcess">
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

          {/* Does your solution have an expected start and/or end date? */}
          <FormGroup>
            <Fieldset legend={t('basic.labels.solutionDate')}>
              <Radio
                id="solutionDate-yes"
                name="solutionDate"
                value="true"
                label={t('basic.options.yes')}
              />

              {/* <div className="margin-left-4 mobile-lg:display-flex"> */}
              <div className="margin-left-4">
                {/* Expected start date */}
                <FormGroup className="flex-1">
                  <Label
                    htmlFor="expectedStartDate"
                    hint={<div>mm/dd/yyyy</div>}
                  >
                    {t('basic.labels.expectedStartDate')}
                  </Label>
                  <DatePicker id="expectedStartDate" name="expectedStartDate" />
                </FormGroup>
                {/* Expected go live date */}
                <FormGroup className="flex-1">
                  <Label
                    htmlFor="expectedLiveDate"
                    hint={<div>mm/dd/yyyy</div>}
                  >
                    {t('basic.labels.expectedLiveDate')}
                  </Label>
                  <DatePicker id="expectedLiveDate" name="expectedLiveDate" />
                </FormGroup>
              </div>

              <Radio
                id="solutionDate-no"
                name="solutionDate"
                value="false"
                label={t('basic.options.no')}
              />
            </Fieldset>
          </FormGroup>

          {/* Select any other OIT groups that you have met with or collaborated with. */}
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

          <Pager
            next={{
              disabled: !done
            }}
          />
        </Form>
      </Grid>
    </Grid>
  );
}

export default Basic;
