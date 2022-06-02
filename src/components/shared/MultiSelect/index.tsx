import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconClose, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

type OptionType = {
  label: string;
  value: string | number;
};

type OptionsProps = {
  options: OptionType[];
  selected: OptionType[];
  optionClick: (option: OptionType) => void;
};

const Options = ({ options, selected, optionClick }: OptionsProps) => {
  const { t } = useTranslation();
  return (
    <ul className="easi-multiselect__options usa-list--unstyled padding-y-05 border-1px border-top-0 maxh-card overflow-scroll position-absolute right-0 left-0 z-top bg-white">
      {options.map(option => (
        <li
          className="display-flex flex-align-center padding-y-05 padding-x-1"
          key={option.value}
          role="option"
          aria-selected={selected.includes(option)}
        >
          <label>
            <input
              className="margin-right-1"
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => optionClick(option)}
            />
            {t(option.label)}
          </label>
        </li>
      ))}
    </ul>
  );
};

type MultiSelectProps = {
  className?: string;
  id?: string;
  placeholder?: string;
  options: OptionType[];
  selectedLabel?: string;
  tags?: boolean;
  disabled?: boolean;
};

export default function MultiSelect({
  className,
  id,
  placeholder,
  options,
  selectedLabel = 'Selected options',
  tags = false,
  disabled = false
}: MultiSelectProps) {
  const [searchValue, setSearchValue] = useState('');

  const [selected, setSelected] = useState<any[]>([]);
  const [active, setActive] = useState(false);

  const { t } = useTranslation();
  const selectRef = useRef(null);

  const optionClick = (option: OptionType) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(selectedOption => selectedOption !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  return (
    <div
      className={classNames(
        'easi-multiselect maxw-mobile-lg position-relative',
        className
      )}
    >
      <div className="easi-multiselect__field" role="listbox" ref={selectRef}>
        <div className="usa-select maxw-none padding-0">
          <input
            type="search"
            className="usa-input padding-1 height-full border-0"
            value={searchValue}
            onClick={() => setActive(true)}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        {active && (
          <Options
            options={options}
            selected={selected}
            optionClick={optionClick}
          />
        )}
      </div>
      <div className="easi-multiselect__selected-list margin-top-3">
        {t(selectedLabel)}
        {selected && (
          <ul className="usa-list--unstyled margin-top-1">
            {selected.map(option => (
              <li
                key={option.value}
                className="display-flex flex-justify-start margin-y-05"
              >
                <Tag className="bg-primary-lighter text-ink text-no-uppercase padding-y-1 padding-x-105 display-flex flex-align-center">
                  {option.label}
                  <IconClose
                    className="margin-left-1"
                    onClick={() => optionClick(option)}
                  />
                </Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
