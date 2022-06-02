import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconClose, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

type OptionsProps = {
  options: string[];
  selected: string[];
  optionClick: (option: string) => void;
};

const Options = ({ options, selected, optionClick }: OptionsProps) => {
  const { t } = useTranslation();
  return (
    <ul className="easi-multiselect__options usa-list--unstyled padding-y-05 border-1px border-top-0 maxh-card overflow-scroll position-absolute right-0 left-0 z-top bg-white">
      {options.map(option => {
        return (
          <li
            className="display-flex flex-align-center padding-y-05 padding-x-1"
            key={option}
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
              {t(option)}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

type MultiSelectProps = {
  className?: string;
  id?: string;
  options: string[];
  selectedLabel?: string;
  onChange: (value: string[]) => void;
  initialValues: string[];
};

export default function MultiSelect({
  className,
  id,
  options,
  selectedLabel = 'Selected options',
  onChange,
  initialValues
}: MultiSelectProps) {
  const [searchValue, setSearchValue] = useState('');

  const [selected, setSelected] = useState<any[]>(initialValues);
  const [active, setActive] = useState(false);

  const { t } = useTranslation();
  const selectRef = useRef(null);

  const optionClick = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(selectedOption => selectedOption !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const filterSearchResults = () => {
    const searchIndex = (option: string) => {
      return option.toLowerCase().search(searchValue);
    };
    return options
      .filter(option => searchIndex(option) > -1)
      .sort((a, b) => searchIndex(a) - searchIndex(b));
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setActive(false);
        setSearchValue('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <div
      className={classNames(
        'easi-multiselect maxw-mobile-lg position-relative',
        className
      )}
      id={id}
    >
      <div className="easi-multiselect__field" role="listbox" ref={selectRef}>
        <div className="usa-select maxw-none padding-0">
          <input
            type="search"
            className="usa-input padding-1 height-full border-0"
            value={searchValue}
            placeholder={t(`${selected.length} selected`)}
            onClick={() => setActive(true)}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
        {active && (
          <Options
            options={searchValue ? filterSearchResults() : options}
            selected={selected}
            optionClick={optionClick}
          />
        )}
      </div>
      {selected.length > 0 && (
        <div className="easi-multiselect__selected-list margin-top-3">
          {t(selectedLabel)}
          <ul className="usa-list--unstyled margin-top-1">
            {selected.map(option => (
              <li
                key={option}
                className="display-flex flex-justify-start margin-y-05"
              >
                <Tag className="bg-primary-lighter text-ink text-no-uppercase padding-y-1 padding-x-105 display-flex flex-align-center">
                  {option}
                  <IconClose
                    className="margin-left-1"
                    onClick={() => optionClick(option)}
                  />
                </Tag>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
