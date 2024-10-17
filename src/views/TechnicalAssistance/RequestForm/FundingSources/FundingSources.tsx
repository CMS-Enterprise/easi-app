/**
 * This component was previously used for both the system intake and TRB forms, and will be
 * deprecated when `/components/FundingSources` is refactored to work with both forms.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Fieldset, Label, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import MultiSelect from 'components/shared/MultiSelect';
import { GetTrbRequest_trbRequest_form_fundingSources as FundingSource } from 'queries/types/GetTrbRequest';
import {
  FormattedFundingSourcesObject,
  MultiFundingSource,
  UpdateActiveFundingSource,
  UpdateFundingSources
} from 'types/technicalAssistance';

import useIntakeFundingSources from './useTrbFundingSources';

type FundingSourcesListItemProps = {
  fundingNumber: string;
  sources: (string | null)[];
  handleDelete?: () => void;
  handleEdit?: () => void;
  className?: string;
};

const FundingSourcesListItem = ({
  fundingNumber,
  sources,
  handleDelete,
  handleEdit,
  className
}: FundingSourcesListItemProps) => {
  const { t } = useTranslation('intake');

  const fundingNumberText = `${t(
    'contractDetails.fundingSources.fundingNumber'
  )}: ${fundingNumber}`;
  const fundingSourceText = `${t(
    'contractDetails.fundingSources.fundingSources'
  )}: ${sources.join(', ')}`;
  return (
    <li
      className={classNames('funding-source', className)}
      id={`fundingNumber-${fundingNumber}`}
    >
      <p className="text-bold font-body-sm margin-bottom-0">
        {t('contractDetails.fundingSources.fundingSource')}
      </p>
      <p className="margin-y-05">{fundingNumberText}</p>
      <p className="margin-y-05">{fundingSourceText}</p>
      {handleEdit && (
        <Button
          unstyled
          onClick={() => handleEdit()}
          type="button"
          className="margin-right-1 margin-top-1"
          data-testid="fundingSourcesAction-delete"
        >
          {t('Edit')}
        </Button>
      )}
      {handleDelete && (
        <Button
          unstyled
          onClick={() => handleDelete()}
          type="button"
          className="text-error margin-top-1"
          data-testid="fundingSourcesAction-delete"
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
  action: 'Add' | 'Edit' | null;
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

    if (updatedErrors.fundingNumber || updatedErrors.sources) {
      // Set errors
      setErrors(updatedErrors);
    }

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

    return {
      err: updatedErrors
    };
  };
  return (
    <>
      <Fieldset className="margin-top-3">
        <legend className="usa-legend text-bold">
          {t(`${action} funding source`)}
        </legend>
        <FieldGroup
          className="margin-top-2"
          scrollElement="fundingSource.fundingNumber"
          error={!!errors.fundingNumber}
        >
          <Label htmlFor="IntakeForm-FundingNumber" className="text-normal">
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
          <Label htmlFor="IntakeForm-FundingSources" className="text-normal">
            {t('contractDetails.fundingSources.fundingSource')}
          </Label>
          <FieldErrorMsg>{errors.sources}</FieldErrorMsg>
          <MultiSelect
            id="IntakeForm-FundingSources"
            name="fundingSources"
            selectedLabel={t('Funding sources')}
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
      </Fieldset>
      <Button
        type="button"
        onClick={() =>
          setActiveFundingSource({
            action: null
          })
        }
        className="display-inline-block margin-top-2"
        outline
        data-testid="fundingSourcesAction-cancel"
      >
        {t(`Cancel`)}
      </Button>
      <Button
        type="button"
        onClick={() => {
          const { err } = onSubmit();
          if (!err) {
            setActiveFundingSource({
              action: null
            });
          }
        }}
        className="display-inline-block margin-top-2"
        data-testid="fundingSourcesAction-save"
      >
        {t(`Save`)}
      </Button>
    </>
  );
};

type FundingSourcesProps = {
  id?: string;
  initialValues: FundingSource[];
  fundingSourceOptions: string[];
  setFieldValue: (value: any) => void;
  setFieldActive?: (active: boolean) => void;
  combinedFields?: boolean;
};

/** Funding sources component for use in TRB request form */
const FundingSources = ({
  id,
  initialValues,
  fundingSourceOptions,
  setFieldValue,
  setFieldActive,
  combinedFields = false
}: FundingSourcesProps) => {
  // Get funding sources actions from useIntakeFundingSources custom hook
  const fundingSourcesData = useIntakeFundingSources(
    initialValues,
    setFieldValue,
    combinedFields
  );
  const [fundingSources, setFundingSources] = fundingSourcesData.fundingSources;
  const [activeFundingSource, setActiveFundingSource, action] =
    fundingSourcesData.activeFundingSource;
  const { t } = useTranslation('intake');
  const editFundingSourceNumber = useRef('');

  useEffect(() => {
    setFieldActive?.(!!action);
  }, [action, setFieldActive]);

  return (
    <>
      {Object.keys(fundingSources).length > 0 && (
        <ul
          id={id || 'Intake-Form-ExistingFundingSources'}
          className="usa-list--unstyled margin-bottom-4 margin-top-3"
        >
          {Object.values(fundingSources).map(fundingSource => {
            const { fundingNumber, sources } = fundingSource;
            return editFundingSourceNumber.current === fundingNumber &&
              action === 'Edit' ? (
              <li key={fundingNumber}>
                <FundingSourceForm
                  activeFundingSource={activeFundingSource}
                  setActiveFundingSource={setActiveFundingSource}
                  fundingSources={fundingSources}
                  setFundingSources={setFundingSources}
                  fundingSourceOptions={fundingSourceOptions}
                  action={action}
                />
              </li>
            ) : (
              <FundingSourcesListItem
                key={fundingNumber}
                className="margin-y-205"
                fundingNumber={fundingNumber!}
                sources={sources}
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
      {!action && (
        <Button
          type="button"
          data-testid="fundingSourcesAction-add"
          onClick={() => setActiveFundingSource({ action: 'Add' })}
          className="display-block margin-top-3"
          outline
        >
          {Object.keys(fundingSources).length > 0
            ? t('contractDetails.fundingSources.addAnotherFundingSource')
            : t('contractDetails.fundingSources.addFundingSource')}
        </Button>
      )}
    </>
  );
};

export default FundingSources;
