import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Label, Link } from '@trussworks/react-uswds';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import MultiSelect from 'components/shared/MultiSelect';
import {
  FormattedFundingSourcesObject,
  FundingSource,
  MultiFundingSource,
  UpdateActiveFundingSource,
  UpdateFundingSources
} from 'types/systemIntake';

import useIntakeFundingSources from './useIntakeFundingSources';

type FundingSourcesListItemProps = {
  fundingNumber: string;
  fundingSources: (string | null)[];
  label?: boolean;
  handleDelete?: () => void;
  handleEdit?: () => void;
};

export const FundingSourcesListItem = ({
  fundingNumber,
  fundingSources,
  label = true,
  handleDelete,
  handleEdit
}: FundingSourcesListItemProps) => {
  const { t } = useTranslation('intake');
  return (
    <li id={`fundingNumber-${fundingNumber}`} key={fundingNumber}>
      {label && (
        <h4 className="margin-bottom-0">
          {t('contractDetails.fundingSources.fundingSource')}
        </h4>
      )}
      <p className="margin-y-1">
        {`${t(
          'contractDetails.fundingSources.fundingNumber'
        )}: ${fundingNumber}`}
      </p>
      <p className="margin-y-1">
        {`${t(
          'contractDetails.fundingSources.fundingSources'
        )}: ${fundingSources.join(', ')}`}
      </p>
      {handleEdit && (
        <Button
          unstyled
          small
          onClick={() => handleEdit()}
          type="button"
          className="margin-right-1"
        >
          {t('Edit')}
        </Button>
      )}
      {handleDelete && (
        <Button
          unstyled
          small
          onClick={() => handleDelete()}
          type="button"
          className="text-error"
        >
          {t('Delete')}
        </Button>
      )}
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
        className="margin-top-2"
        scrollElement="fundingSource.fundingNumber"
        error={!!errors.fundingNumber}
      >
        <Label htmlFor="fundingNumber" className="text-normal">
          {t('contractDetails.fundingSources.fundingNumber')}
        </Label>
        <HelpText
          id="IntakeForm-FundingNumberRestrictions"
          className="margin-top-1"
        >
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
      <FieldGroup error={!!errors.sources} className="margin-y-2">
        <Label htmlFor="fundingSources" className="text-normal">
          {t('contractDetails.fundingSources.fundingSource')}
        </Label>
        <FieldErrorMsg>{errors.sources}</FieldErrorMsg>
        <MultiSelect
          id="IntakeForm-FundingSources"
          name="fundingSources"
          selectedLabel={t('Funding sources')}
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
        onClick={() =>
          setActiveFundingSource({
            action: 'Reset'
          })
        }
        className="display-inline-block margin-top-2"
        outline
      >
        {t(`Cancel`)}
      </Button>
      <Button
        type="button"
        onClick={() => onSubmit()}
        className="display-inline-block margin-top-2"
      >
        {t(`Save`)}
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
    <div className="systemIntake-fundingSources">
      {Object.keys(fundingSources).length > 0 && (
        <ul className="systemIntake-fundingSourcesList usa-list--unstyled margin-bottom-4">
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
                  setActiveFundingSource({
                    action: 'Edit',
                    data: fundingSource
                  });
                }}
              />
            );
          })}
        </ul>
      )}
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
          className="display-block margin-top-3"
          outline
        >
          {Object.keys(fundingSources).length > 0
            ? t('contractDetails.fundingSources.addAnotherFundingSource')
            : t('contractDetails.fundingSources.addFundingSource')}
        </Button>
      )}
    </div>
  );
};

export default FundingSources;
