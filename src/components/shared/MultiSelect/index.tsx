import React, { useState } from 'react';
import Select, { MultiValue, OptionProps } from 'react-select';
import { IconClose, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

import CheckboxField from '../CheckboxField';

import './index.scss';

type MultiSelectOptionProps = {
  value: string;
  label: string;
};

const Option = (props: OptionProps<MultiSelectOptionProps, true>) => {
  const { data, isSelected, innerProps, innerRef, isFocused } = props;
  // console.log(props);
  return (
    <div
      {...innerProps}
      ref={innerRef}
      className={classNames('usa-combo-box__list-option', {
        'usa-combo-box__list-option--focused': isFocused
      })}
    >
      <CheckboxField
        label={data.label}
        id={innerProps.id!}
        name={data.value}
        checked={isSelected}
        onChange={() => null}
        onBlur={() => null}
        value={data.value}
      />
    </div>
  );
};

const MultiSelectTag = ({
  id,
  label,
  className,
  handleRemove
}: {
  id: string;
  label: string;
  className?: string;
  handleRemove?: (value: string) => void;
}) => {
  return (
    <Tag
      id={id}
      data-testid={`multiselect-tag--${label}`}
      className={classNames(
        'easi-multiselect--tag padding-x-1 padding-y-05 bg-primary-lighter text-ink display-inline-flex text-no-uppercase flex-align-center',
        className
      )}
    >
      {label}{' '}
      {handleRemove && (
        <IconClose
          onClick={() => handleRemove(label)}
          onKeyDown={() => handleRemove(label)}
          className="margin-left-05"
          tabIndex={0}
          role="button"
          aria-label={`Remove ${label}`}
        />
      )}
    </Tag>
  );
};

const MultiSelect = ({
  id,
  name,
  selectedLabel,
  options,
  onChange,
  initialValues,
  className
}: {
  id: string;
  name: string;
  selectedLabel?: string;
  options: MultiSelectOptionProps[];
  onChange: (values: string[]) => void;
  initialValues?: string[];
  className?: string;
}) => {
  const [selected, setSelected] = useState<MultiValue<MultiSelectOptionProps>>(
    initialValues
      ? options.filter(option => initialValues.includes(option.value))
      : []
  );

  return (
    <div>
      <Select
        id={id}
        name={name}
        className={classNames('easi-multiselect usa-combo-box', className)}
        options={options}
        components={{ Option }}
        isMulti
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        onChange={selectedOptions => {
          setSelected(selectedOptions);
          onChange(selectedOptions.map(option => option.value));
        }}
        value={selected}
        controlShouldRenderValue={false}
        placeholder={`${selected.length} selected`}
      />
      {selected.length > 0 && (
        <div className="easi-multiselect--selected">
          <h4 className="text-normal margin-bottom-1">
            {selectedLabel || 'Selected options'}
          </h4>
          <ul className="usa-list--unstyled">
            {selected.map(({ value, label }) => (
              <li
                className="margin-bottom-05 margin-right-05 display-inline-block"
                key={value}
              >
                <MultiSelectTag
                  id={`selected-${value}`}
                  key={value}
                  label={label}
                  handleRemove={() => {
                    const updatedValues = selected.filter(
                      option => option.value !== value
                    );
                    setSelected(updatedValues);
                    onChange(updatedValues.map(option => option.value));
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
