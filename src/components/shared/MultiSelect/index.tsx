import React, { useState } from 'react';
import Select, {
  components,
  InputProps,
  MultiValue,
  OptionProps
} from 'react-select';
import { IconClose, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

type MultiSelectOptionProps = {
  value: string;
  label: string;
};

const Option = (props: OptionProps<MultiSelectOptionProps, true>) => {
  const { data, isSelected, innerProps, innerRef } = props;
  return (
    <div {...innerProps} ref={innerRef}>
      <label>
        <input type="checkbox" checked={isSelected} onChange={() => null} />
        {data.label}
      </label>
    </div>
  );
};

export const MultiSelectTag = ({
  label,
  className,
  handleRemove
}: {
  label: string;
  className?: string;
  handleRemove?: (value: string) => void;
}) => {
  return (
    <Tag
      className={classNames(
        'padding-x-1 padding-y-05 bg-primary-lighter text-ink display-inline-flex text-no-uppercase flex-align-center',
        className
      )}
    >
      {label}{' '}
      {handleRemove && (
        <IconClose
          onClick={() => handleRemove(label)}
          className="margin-left-05"
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
        className={classNames('usa-combo-box', className)}
        options={options}
        components={{ Option }}
        isMulti
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        onChange={selectedOptions => {
          setSelected(selectedOptions);
          onChange(selectedOptions.map(option => option.value));
        }}
        value={selected}
        controlShouldRenderValue={false}
        placeholder={`${selected.length} selected`}
      />
      <h4 className="text-normal margin-bottom-1">
        {selectedLabel || 'Selected options'}
      </h4>
      {selected.map(({ value, label }) => (
        <MultiSelectTag
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
      ))}
    </div>
  );
};

export default MultiSelect;
