import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  IconClose,
  IconExpandMore,
  Tag
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

type OptionType = {
  label: string;
  value: string;
};

type OptionsProps = {
  options: OptionType[];
  selected: OptionType[];
  optionClick: (option: OptionType) => void;
};

const Options = ({ options, selected, optionClick }: OptionsProps) => {
  const { t } = useTranslation();
  return (
    <div className="easi-multiselect__options padding-y-05 border-1px border-top-0 overflow-scroll position-absolute right-0 left-0 z-top bg-white">
      {options.length > 0 ? (
        options.map(option => {
          return (
            <Checkbox
              className="padding-1 hover:bg-base-lightest"
              key={option.value}
              defaultChecked={selected.some(
                selectedOption => selectedOption.value === option.value
              )}
              id={`easi-multiselect__option-${option.value}`}
              name={`easi-multiselect-${option.value}`}
              label={t(option.label)}
              onChange={() => optionClick(option)}
            />
          );
        })
      ) : (
        <span className="padding-1">No results</span>
      )}
    </div>
  );
};

type MultiSelectProps = {
  className?: string;
  id?: string;
  options: OptionType[];
  selectedLabel?: string;
  onChange: (value: string[]) => void;
  initialValues?: OptionType[];
};

export default function MultiSelect({
  className,
  id,
  options,
  selectedLabel = 'Selected options',
  onChange,
  initialValues = []
}: MultiSelectProps) {
  const [searchValue, setSearchValue] = useState('');

  const [selected, setSelected] = useState<any[]>(initialValues);
  const [active, setActive] = useState(false);

  const { t } = useTranslation();
  const selectRef = useRef(null);

  const optionClick = (option: OptionType) => {
    if (
      selected.some(selectedOption => selectedOption.value === option.value)
    ) {
      setSelected(
        selected.filter(selectedOption => selectedOption.value !== option.value)
      );
    } else {
      setSelected([...selected, option]);
    }
  };

  const filterSearchResults = () => {
    const searchIndex = (option: string) => {
      return option.toLowerCase().search(searchValue);
    };
    return options
      .filter(option => searchIndex(option.label) > -1)
      .sort((a, b) => searchIndex(a.label) - searchIndex(b.label));
  };

  useEffect(() => {
    function handleClickOutside(e: any) {
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
          <div className="easi-multiselect__controls">
            {selected.length > 0 && (
              <div className="easi-multiselect__controls-button border-right-1px">
                <IconClose
                  onClick={() => setSelected([])}
                  size={3}
                  role="button"
                />
              </div>
            )}
            <div className="easi-multiselect__controls-button">
              <IconExpandMore
                onClick={() => setActive(!active)}
                size={4}
                role="button"
              />
            </div>
          </div>
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
                key={option.value}
                className="display-flex flex-justify-start margin-y-05"
              >
                <Tag
                  className="bg-primary-lighter text-ink text-no-uppercase padding-y-1 padding-x-105 display-flex flex-align-center"
                  id={`easi-multiselect__tag-${option.value}`}
                >
                  {option.label}
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
