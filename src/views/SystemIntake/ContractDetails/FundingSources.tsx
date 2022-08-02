import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Label, Link } from '@trussworks/react-uswds';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import MultiSelect, { MultiSelectTag } from 'components/shared/MultiSelect';
import { GetSystemIntake_systemIntake_fundingSources as FundingSourcesType } from 'queries/types/GetSystemIntake';

type FundingSource = {
  fundingNumber: string;
  sources: string[];
};

type FundingSourcesObject = {
  [number: string]: {
    fundingNumber: string | null;
    sources: (string | null)[];
  };
};

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
  action: 'Add' | 'Edit';
  activeFundingSource: FundingSource;
  setActiveFundingSource: (source: FundingSource | null) => void;
  fundingSources: FundingSourcesType[];
  updateFundingSources: (
    sources: FundingSourcesType[],
    validate: boolean
  ) => void;
  fundingSourceOptions: string[];
};

const FundingSourceForm = ({
  action,
  activeFundingSource,
  setActiveFundingSource,
  fundingSources,
  updateFundingSources,
  fundingSourceOptions
}: FundingSourceFormProps) => {
  const { t } = useTranslation('intake');
  const initialFundingNumber = useRef(activeFundingSource.fundingNumber);
  const [errors, setErrors] = useState({
    fundingNumber: '',
    sources: ''
  });

  // Submit funding source form
  const onSubmit = () => {
    const { sources, fundingNumber } = activeFundingSource as FundingSource;
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
      fundingSources.some(
        source =>
          source.fundingNumber === fundingNumber &&
          source.fundingNumber !== initialFundingNumber.current
      )
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
      // Format funding sources
      const updatedValues = activeFundingSource?.sources.map(source => ({
        fundingNumber: activeFundingSource.fundingNumber,
        source
      }));

      if (action === 'Edit') {
        // Edit funding sources
        updateFundingSources(
          [
            ...fundingSources.filter(
              source => source.fundingNumber !== fundingNumber
            ),
            ...(updatedValues as FundingSourcesType[])
          ],
          true
        );
      } else {
        // Add new funding sources
        updateFundingSources(
          [...fundingSources, ...(updatedValues as FundingSourcesType[])],
          true
        );
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
          value={activeFundingSource.fundingNumber}
          onChange={e =>
            setActiveFundingSource({
              ...activeFundingSource,
              fundingNumber: e.target.value
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
          onChange={(sources: string[]) =>
            setActiveFundingSource({ ...activeFundingSource, sources })
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
      {fundingSources.length > 0 && (
        <Button
          type="button"
          onClick={() => setActiveFundingSource(null)}
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
  initialValues: FundingSourcesType[];
  fundingSourceOptions: string[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

const emptyFundingSource: FundingSource = {
  fundingNumber: '',
  sources: []
};

const FundingSources = ({
  initialValues,
  fundingSourceOptions,
  setFieldValue
}: FundingSourcesProps) => {
  const { t } = useTranslation('intake');
  const [fundingSources, setFundingSources] = useState(initialValues || []);
  const [
    activeFundingSource,
    setActiveFundingSource
  ] = useState<FundingSource | null>(
    initialValues.length > 0 ? null : emptyFundingSource
  );

  // Update funding sources
  const updateFundingSources = (
    sources: FundingSourcesType[],
    validate: boolean
  ) => {
    setFundingSources(sources);
    setActiveFundingSource(sources.length > 0 ? null : emptyFundingSource);
    setFieldValue('fundingSources', sources, validate);
  };

  // Format funding sources for display by funding number
  const fundingSourcesObject = useMemo(() => {
    return fundingSources.reduce<FundingSourcesObject>(
      (acc, { fundingNumber, source }) => {
        const sourcesArray = acc[fundingNumber!]
          ? [...acc[fundingNumber!].sources, source]
          : [source];
        // Return formatted object of funding sources
        return {
          ...acc,
          [fundingNumber!]: {
            fundingNumber,
            sources: sourcesArray
          }
        };
      },
      {}
    );
  }, [fundingSources]);

  return (
    <div className="margin-bottom-2">
      <ul className="systemIntake-fundingSources usa-list--unstyled">
        {Object.values(fundingSourcesObject).map(fundingSource => {
          const { fundingNumber, sources } = fundingSource;
          return activeFundingSource?.fundingNumber === fundingNumber ? (
            <FundingSourceForm
              key={fundingNumber}
              action="Edit"
              activeFundingSource={activeFundingSource}
              setActiveFundingSource={setActiveFundingSource}
              fundingSources={fundingSources}
              updateFundingSources={updateFundingSources}
              fundingSourceOptions={fundingSourceOptions}
            />
          ) : (
            <FundingSourcesListItem
              key={fundingNumber}
              fundingNumber={fundingNumber!}
              fundingSources={sources}
              handleDelete={() =>
                updateFundingSources(
                  initialValues.filter(
                    source => source.fundingNumber !== fundingNumber
                  ),
                  false
                )
              }
              handleEdit={() =>
                setActiveFundingSource(fundingSource as FundingSource)
              }
            />
          );
        })}
      </ul>
      {activeFundingSource &&
        !initialValues.some(
          source => source.fundingNumber === activeFundingSource.fundingNumber
        ) && (
          <FundingSourceForm
            action="Add"
            activeFundingSource={activeFundingSource}
            setActiveFundingSource={setActiveFundingSource}
            fundingSources={fundingSources}
            updateFundingSources={updateFundingSources}
            fundingSourceOptions={fundingSourceOptions}
          />
        )}
      {!activeFundingSource && (
        <Button
          type="button"
          onClick={() => setActiveFundingSource(emptyFundingSource)}
          className="display-block margin-top-2"
        >
          {t('contractDetails.fundingSources.addNewFundingSource')}
        </Button>
      )}
    </div>
  );
};

export default FundingSources;
