import React, { useState } from 'react';
import Select, { MultiValue, OptionProps } from 'react-select';
import { Tag } from '@trussworks/react-uswds';

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

const MultiSelect = ({ options }: { options: MultiSelectOptionProps[] }) => {
  const [selected, setSelected] = useState<MultiValue<MultiSelectOptionProps>>(
    []
  );
  return (
    <div>
      <Select
        options={options}
        components={{ Option }}
        isMulti
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        hideSelectedOptions={false}
        onChange={selectedOptions => setSelected(selectedOptions)}
        value={selected}
        controlShouldRenderValue={false}
        placeholder={`${selected.length} selected`}
      />
      {selected.map(option => (
        <Tag key={option.value}>{option.label}</Tag>
      ))}
    </div>
  );
};

export default MultiSelect;
