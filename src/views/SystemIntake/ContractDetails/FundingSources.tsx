import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Label, Link } from '@trussworks/react-uswds';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import MultiSelect, { MultiSelectTag } from 'components/shared/MultiSelect';
import {
  FormattedFundingSourcesObject,
  FundingSource,
  MultiFundingSource,
  UpdateActiveFundingSource,
  UpdateFundingSources
} from 'types/systemIntake';

import useIntakeFundingSources from './useIntakeFundingSources';

const FundingSourcesListItem = ({
  fundingNumber,
  fundingSources,
  handleDelete,
  handleEdit
}: {
  fundingNumber: string;
  fundingSources: (string | null)[];
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <li id={`fundingNumber-${fundingNumber}`} key={fundingNumber}>
      <h4 className="margin-bottom-1">
        Funding Number: <span className="text-normal">{fundingNumber}</span>
      </h4>
      {fundingSources.map(source => (
        <MultiSelectTag
          key={`${fundingNumber}-${source}`}
          id={`fundingSource-${source}`}
          label={t(source!)}
          className="padding-x-1 padding-y-05"
        />
      ))}
      <div className="margin-top-1">
        <Button
          unstyled
          small
          onClick={() => handleEdit()}
          type="button"
          className="margin-right-1"
        >
          {t('Edit')}
        </Button>
        <Button
          unstyled
          small
          onClick={() => handleDelete()}
          type="button"
          className="text-error"
        >
          {t('Delete')}
        </Button>
      </div>
    </li>
  );
};

type FundingSourceFormProps = {
  activeFundingSource: MultiFundingSource;
  setActiveFundingSource: (payload: UpdateActiveFundingSource) => void;
  fundingSources: FormattedFundingSourcesObject;
  setFundingSources: ({ action, data }: UpdateFundingSources) => void;
  fundingSourceOptions: string[];
  action: 'Add' | 'Edit' | 'Reset';
};

const FundingSourceForm = ({
  activeFundingSource,
  setActiveFundingSource,
  fundingSources,
  setFundingSources,
  fundingSourceOptions,
  action
}: FundingSourceFormProps) => {
  const { t } = useTranslation('intake');
  const { sources, fundingNumber } = activeFundingSource;
  const initialFundingNumber = useRef(fundingNumber);
  const [errors, setErrors] = useState({
    fundingNumber: '',
    sources: ''
  });

  // Submit funding source form
  const onSubmit = () => {
    const updatedErrors = { fundingNumber: '', sources: '' };

    // Check funding number is 6 digits
    if (fundingNumber.length !== 6) {
      updatedErrors.fundingNumber = t(
        'contractDetails.fundingSources.errors.fundingNumberMinDigits'
      );
    }

    // Check if funding number is a number
    if (fundingNumber.length > 0 && !fundingNumber.match(/^\d+$/)) {
      updatedErrors.fundingNumber = t(
        'contractDetails.fundingSources.errors.fundingNumberDigits'
      );
    }

    // Check if funding number is unique
    if (
      fundingNumber !== initialFundingNumber.current &&
      fundingSources[fundingNumber]
    ) {
      updatedErrors.fundingNumber = t(
        'contractDetails.fundingSources.errors.fundingNumberUnique'
      );
    }

    // Check if funding source is selected
    if (sources.length < 1) {
      updatedErrors.sources = t(
        'contractDetails.fundingSources.errors.fundingSource'
      );
    }

    // Set errors
    setErrors(updatedErrors);

    // If no errors, update funding sources
    if (!updatedErrors.fundingNumber && !updatedErrors.sources) {
      if (action === 'Add') {
        // Add new funding source
        setFundingSources({
          data: { fundingNumber, sources },
          action: 'Add'
        });
      } else {
        // Edit funding source
        setFundingSources({
          data: {
            initialFundingNumber: initialFundingNumber.current,
            fundingNumber,
            sources
          },
          action: 'Edit'
        });
      }
    }
  };
  return (
    <>
      <h4 className="margin-bottom-1">{t(`${action} funding source`)}</h4>
      <FieldGroup
        className="margin-top-1"
        scrollElement="fundingSource.fundingNumber"
        error={!!errors.fundingNumber}
      >
        <Label htmlFor="fundingNumber" className="text-normal">
          {t('contractDetails.fundingSources.fundingNumber')}
        </Label>
        <HelpText id="IntakeForm-FundingNumberRestrictions">
          {t('contractDetails.fundingSources.fundingNumberHelpText')}
        </HelpText>
        <FieldErrorMsg>{errors.fundingNumber}</FieldErrorMsg>
        <input
          maxLength={6}
          type="text"
          className="usa-input"
          id="IntakeForm-FundingNumber"
          name="fundingNumber"
          value={fundingNumber}
          onChange={e =>
            setActiveFundingSource({
              action,
              data: { ...activeFundingSource, fundingNumber: e.target.value }
            })
          }
        />
        <HelpText id="IntakeForm-FundingNumberHelp" className="margin-top-1">
          <Link
            href="https://cmsintranet.share.cms.gov/JT/Pages/Budget.aspx"
            target="_blank"
            rel="noopener noreferrer"
            variant="external"
          >
            {t('contractDetails.fundingSources.fundingNumberLink')}
          </Link>
        </HelpText>
      </FieldGroup>
      <FieldGroup error={!!errors.sources}>
        <Label htmlFor="fundingSources" className="text-normal">
          {t('contractDetails.fundingSources.fundingSourceLabel')}
        </Label>
        <HelpText id="IntakeForm-FundingSourceHelpText">
          {t('contractDetails.fundingSources.fundingSourceHelpText')}
        </HelpText>
        <FieldErrorMsg>{errors.sources}</FieldErrorMsg>
        <MultiSelect
          id="IntakeForm-FundingSources"
          name="fundingSources"
          selectedLabel="Selected models"
          className="margin-top-1"
          options={fundingSourceOptions.map(option => ({
            value: option,
            label: t(option)
          }))}
          onChange={(values: string[]) =>
            setActiveFundingSource({
              action,
              data: { ...activeFundingSource, sources: values }
            })
          }
          initialValues={activeFundingSource.sources}
        />
      </FieldGroup>
      <Button
        type="button"
        onClick={() => onSubmit()}
        className="display-inline-block margin-top-2"
      >
        {t(`${action} funding source`)}
      </Button>
      {Object.keys(fundingSources).length > 0 && (
        <Button
          type="button"
          onClick={() => setActiveFundingSource({ action: 'Reset' })}
          className="display-inline-block margin-top-2"
          outline
        >
          {t('Cancel')}
        </Button>
      )}
    </>
  );
};

type FundingSourcesProps = {
  initialValues: FundingSource[];
  fundingSourceOptions: string[];
  setFieldValue: (field: string, value: any) => void;
  validateField: (field: string) => void;
};

const FundingSources = ({
  initialValues,
  fundingSourceOptions,
  setFieldValue,
  validateField
}: FundingSourcesProps) => {
  // Get funding sources actions from useIntakeFundingSources custom hook
  const fundingSourcesData = useIntakeFundingSources(
    initialValues,
    setFieldValue,
    validateField
  );
  const [fundingSources, setFundingSources] = fundingSourcesData.fundingSources;
  const [
    activeFundingSource,
    setActiveFundingSource,
    action
  ] = fundingSourcesData.activeFundingSource;
  const { t } = useTranslation('intake');
  const editFundingSourceNumber = useRef('');

  return (
    <div className="margin-bottom-2">
      <ul className="systemIntake-fundingSources usa-list--unstyled">
        {Object.values(fundingSources).map(fundingSource => {
          const { fundingNumber, sources } = fundingSource;
          return editFundingSourceNumber.current === fundingNumber &&
            action === 'Edit' ? (
            <FundingSourceForm
              key={fundingNumber}
              activeFundingSource={activeFundingSource}
              setActiveFundingSource={setActiveFundingSource}
              fundingSources={fundingSources}
              setFundingSources={setFundingSources}
              fundingSourceOptions={fundingSourceOptions}
              action={action}
            />
          ) : (
            <FundingSourcesListItem
              key={fundingNumber}
              fundingNumber={fundingNumber!}
              fundingSources={sources}
              handleDelete={() =>
                setFundingSources({ action: 'Delete', data: fundingSource })
              }
              handleEdit={() => {
                editFundingSourceNumber.current = fundingNumber;
                setActiveFundingSource({ action: 'Edit', data: fundingSource });
              }}
            />
          );
        })}
      </ul>
      {action === 'Add' && (
        <FundingSourceForm
          activeFundingSource={activeFundingSource}
          setActiveFundingSource={setActiveFundingSource}
          fundingSources={fundingSources}
          setFundingSources={setFundingSources}
          fundingSourceOptions={fundingSourceOptions}
          action={action}
        />
      )}
      {action === 'Reset' && (
        <Button
          type="button"
          onClick={() => setActiveFundingSource({ action: 'Add' })}
          className="display-block margin-top-2"
        >
          {t('contractDetails.fundingSources.addNewFundingSource')}
        </Button>
      )}
    </div>
  );
};

export default FundingSources;
