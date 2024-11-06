import React, { CSSProperties, useEffect, useState } from 'react';
import { RefCallBack } from 'react-hook-form';
import Select, {
  ClearIndicatorProps,
  components,
  MultiValue,
  OptionProps
} from 'react-select';
import { Icon, Tag } from '@trussworks/react-uswds';
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
      id={`${innerProps.id}_container`}
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

const ClearIndicator = (
  props: ClearIndicatorProps<MultiSelectOptionProps, true>
) => {
  const {
    selectProps: { id },
    clearValue
  } = props;

  return (
    <button
      type="button"
      id="clear-selection"
      tabIndex={0}
      onClick={() => {
        clearValue();
        document?.getElementById(`react-select-${id}-input`)?.focus();
      }}
      className="usa-button--unstyled"
      aria-label="Clear selection"
    >
      <components.ClearIndicator {...props} />
    </button>
  );
};

const MultiSelectTag = ({
  id,
  parentId,
  label,
  className,
  handleRemove
}: {
  id: string;
  parentId?: string;
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
        <Icon.Close
          onClick={() => handleRemove(label)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleRemove(label);
              // Handler to focus on the first tag after one has been removed
              if (parentId) {
                setTimeout(() => {
                  (
                    document?.querySelector(
                      `#${parentId} .easi-multiselect--tag .usa-icon`
                    ) as HTMLElement
                  )?.focus();
                }, 0);
              }
            }
          }}
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
  disabled,
  className,
  inputRef
}: {
  id?: string;
  inputId?: string;
  name: string;
  selectedLabel?: string;
  options: MultiSelectOptionProps[];
  onChange: (values: string[]) => void;
  initialValues?: string[];
  disabled?: boolean;
  className?: string;
  inputRef?: RefCallBack;
}) => {
  const [selected, setSelected] =
    useState<MultiValue<MultiSelectOptionProps> | null>(
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
      },
      ...(disabled ? { backgroundColor: color('gray-20') } : {})
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: color('base-dark'),
      padding: '6px',
      '&:hover': {
        color: color('base-dark'),
        cursor: 'pointer'
      },
      '> svg': {
        width: '26px',
        height: '26px'
      }
    }),
    clearIndicator: provided => ({
      ...provided,
      color: color('base-dark'),
      padding: '6px',
      '&:hover': {
        color: color('base-dark'),
        cursor: 'pointer'
      },
      '> svg': {
        width: '22px',
        height: '22px'
      }
    }),
    indicatorSeparator: provided => ({
      ...provided,
      backgroundColor: color('base-light')
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
    <>
      <Select
        id={id}
        inputId={inputId}
        name={name}
        className={classNames(
          'easi-multiselect usa-combo-box maxw-none margin-top-1',
          className
        )}
        isClearable
        options={options}
        components={{ ClearIndicator, Option }}
        isMulti
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        onChange={selectedOptions => {
          setSelected(selectedOptions);
          onChange(selectedOptions.map(option => option.value));
        }}
        value={selected}
        controlShouldRenderValue={false}
        placeholder={!disabled && `${selected?.length || 0} selected`}
        styles={customStyles}
        isDisabled={disabled}
        ref={inputRef}
      />
      {selected && selected.length > 0 && (
        <div className="easi-multiselect--selected">
          <h4 className="text-normal margin-bottom-1">
            {selectedLabel || 'Selected options'}
          </h4>
          <ul className="usa-list--unstyled" id={`${id}-tags`}>
            {selected.map(({ value, label }) => (
              <li
                className="margin-bottom-05 margin-right-05 display-inline-block"
                key={value}
              >
                <MultiSelectTag
                  id={`selected-${value}`}
                  parentId={`${id}-tags`}
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
    </>
  );
};

export default MultiSelect;
