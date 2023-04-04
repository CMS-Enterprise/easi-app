import React, { CSSProperties, useEffect, useState } from 'react';
import Select, { MultiValue, OptionProps } from 'react-select';
import { IconClose, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

import color from 'utils/uswdsColor';

import CheckboxField from '../CheckboxField';

import './index.scss';

type MultiSelectOptionProps = {
  value: string;
  label: string;
};

const Option = (props: OptionProps<MultiSelectOptionProps, true>) => {
  const { data, isSelected, innerProps, innerRef, isFocused } = props;
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

/**
 * EASi Multiselect.
 * Uses `react-select/Select` and `@trussworks/react-uswds/Tag`.
 *
 * https://www.figma.com/file/5y4EbRmFUB7xRBKUG4qlup/USWDS-Library?node-id=869%3A7346&t=WrUjXtNxIxMgpPss-0
 */
const MultiSelect = ({
  id,
  inputId,
  name,
  selectedLabel,
  options,
  onChange,
  initialValues,
  className
}: {
  id?: string;
  inputId?: string;
  name: string;
  selectedLabel?: string;
  options: MultiSelectOptionProps[];
  onChange: (values: string[]) => void;
  initialValues?: string[];
  className?: string;
}) => {
  const [
    selected,
    setSelected
  ] = useState<MultiValue<MultiSelectOptionProps> | null>(
    initialValues && options.length
      ? [...options].filter(option => initialValues.includes(option.value))
      : null
  );

  useEffect(() => {
    if (!selected && initialValues && options.length) {
      setSelected(
        options.filter(option => initialValues.includes(option.value))
      );
    }
  }, [options, initialValues, selected]);

  const customStyles: {
    [index: string]: (
      provided: CSSProperties,
      state: { isFocused: boolean }
    ) => CSSProperties;
  } = {
    control: (provided, state) => ({
      ...provided,
      borderColor: color('base-dark'),
      outline: state.isFocused ? `.25rem solid ${color('blue-vivid-40')}` : '',
      borderRadius: 0,
      transition: 'none',
      '&:hover': {
        borderColor: color('base-dark'),
        cursor: 'text'
      }
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: color('base'),
      '&:hover': {
        color: color('base'),
        cursor: 'pointer'
      },
      '> svg': {
        width: '26px',
        height: '26px'
      }
    }),
    clearIndicator: provided => ({
      ...provided,
      color: color('base'),
      '&:hover': {
        color: color('base'),
        cursor: 'pointer'
      },
      '> svg': {
        width: '26px',
        height: '26px'
      }
    }),
    indicatorSeparator: provided => ({
      ...provided,
      marginTop: '10px',
      marginBottom: '10px'
    }),
    menu: provided => ({
      ...provided,
      marginTop: '0px',
      borderRadius: 0,
      border: `1px solid ${color('base-dark')}`,
      borderTop: 'none',
      boxShadow: 'none'
    })
  };

  return (
    <div>
      <Select
        id={id}
        inputId={inputId}
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
        placeholder={`${selected?.length || 0} selected`}
        styles={customStyles}
      />
      {selected && selected.length > 0 && (
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
