import React, { useEffect, useMemo, useState } from 'react';
import { Button, Label, Tag } from '@trussworks/react-uswds';

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

const FundingSourcesList = ({
  fundingSources,
  handleDelete,
  handleEdit
}: {
  fundingSources: FundingSourcesType[];
  handleDelete: (fundingNumber: string) => void;
  handleEdit: () => null; // TODO: Fix handleEdit
}) => {
  const fundingSourcesObject = useMemo(() => {
    return fundingSources.reduce<FundingSourcesObject>(
      (acc, { fundingNumber, source }) => {
        const sourcesArray = acc[fundingNumber!]
          ? new Set([...acc[fundingNumber!].sources, source])
          : [source];
        return {
          ...acc,
          [fundingNumber!]: {
            fundingNumber,
            sources: [...sourcesArray]
          }
        };
      },
      {}
    );
  }, [fundingSources]);
  return (
    <ul className="systemIntake-fundingSources usa-list--unstyled">
      {Object.values(fundingSourcesObject).map(({ fundingNumber, sources }) => (
        <li key={fundingNumber}>
          <h4 className="margin-bottom-1">
            Funding Number: <span className="text-normal">{fundingNumber}</span>
          </h4>
          {sources.map(source => (
            <MultiSelectTag
              key={`${fundingNumber}-${source}`}
              label={source!}
              className="padding-x-1 padding-y-05"
            />
          ))}
          <div className="margin-top-1">
            <Button
              unstyled
              small
              onClick={() => handleEdit()} // TODO: Fix handleEdit
              type="button"
              className="margin-right-1"
            >
              Edit
            </Button>
            <Button
              unstyled
              small
              onClick={() => handleDelete(fundingNumber!)}
              type="button"
              className="text-error"
            >
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
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

const FundingSources = ({
  initialValues,
  fundingSourceOptions,
  setFieldValue
}: FundingSourcesProps) => {
  const [fundingSources, setFundingSources] = useState(initialValues || []);
  const [
    activeFundingSource,
    setActiveFundingSource
  ] = useState<FundingSource | null>(null);

  const [errors, setErrors] = useState({
    fundingNumber: '',
    sources: ''
  });

  const updateFundingSources = (sources: FundingSourcesType[]) => {
    // setFieldValue('fundingSources', sources);
    setFundingSources(sources);
    setActiveFundingSource(null);
  };

  useEffect(() => {
    setFieldValue('fundingSources', fundingSources);
  }, [fundingSources]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = () => {
    const { sources, fundingNumber } = activeFundingSource as FundingSource;
    const updatedErrors = { fundingNumber: '', sources: '' };

    if (fundingNumber.length < 6) {
      updatedErrors.fundingNumber = 'Please enter a 6 digit funding number';
    }
    if (sources.length < 1) {
      updatedErrors.sources = 'Please select a funding source';
    }

    if (!!updatedErrors.fundingNumber || !!updatedErrors.sources) {
      setErrors(updatedErrors);
    } else {
      const updatedValues = activeFundingSource?.sources.map(source => ({
        fundingNumber: activeFundingSource.fundingNumber,
        source
      }));
      updateFundingSources([
        ...initialValues,
        ...(updatedValues as FundingSourcesType[])
      ]);
    }
  };

  return (
    <div className="margin-bottom-2">
      <FundingSourcesList
        fundingSources={initialValues}
        handleDelete={fundingNumber =>
          updateFundingSources(
            initialValues.filter(
              source => source.fundingNumber !== fundingNumber
            )
          )
        }
        handleEdit={() => null} // TODO: Fix handleEdit
      />
      {activeFundingSource && (
        <>
          <h4 className="margin-bottom-1">New funding source</h4>
          <FieldGroup
            className="margin-top-1"
            scrollElement="fundingSource.fundingNumber"
            error={!!errors.fundingNumber}
          >
            <Label htmlFor="fundingNumber" className="text-normal">
              Funding Number
            </Label>
            <HelpText id="IntakeForm-FundingNumberRestrictions">
              Funding number must be 6 digits long
            </HelpText>
            <FieldErrorMsg>{errors.fundingNumber}</FieldErrorMsg>
            <input
              maxLength={6}
              type="text"
              className="usa-input"
              name="fundingNumber"
              value={activeFundingSource.fundingNumber}
              onChange={e =>
                setActiveFundingSource({
                  ...activeFundingSource,
                  fundingNumber: e.target.value
                })
              }
            />
          </FieldGroup>
          <FieldGroup error={!!errors.sources}>
            <Label htmlFor="fundingSources" className="text-normal">
              Which existing models does your proposed track/model most closely
              resemble?
            </Label>
            <HelpText id="IntakeForm-FundingSourceHelpText">
              Start typing the name of the model
            </HelpText>
            <FieldErrorMsg>{errors.sources}</FieldErrorMsg>
            <MultiSelect
              id="fundingSourcesMultiSelect"
              name="fundingSources"
              selectedLabel="Selected models"
              className="margin-top-1"
              options={fundingSourceOptions.map(option => ({
                value: option,
                label: option
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
            Add funding source
          </Button>
          <Button
            type="button"
            onClick={() => setActiveFundingSource(null)}
            className="display-inline-block margin-top-2"
            outline
          >
            Cancel
          </Button>
        </>
      )}
      {!activeFundingSource && (
        <Button
          type="button"
          onClick={() =>
            setActiveFundingSource({ fundingNumber: '', sources: [] })
          }
          className="display-block margin-top-2"
        >
          Add new funding source
        </Button>
      )}
    </div>
  );
};

export default FundingSources;
