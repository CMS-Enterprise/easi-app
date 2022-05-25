import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconClose, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

type MultiSelectProps = {
  className?: string;
  id?: string;
  placeholder?: string;
  options: string[];
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
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const { t } = useTranslation();
  const optionClick = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(selectedOption => selectedOption !== option));
    } else {
      setSelected([...selected, option]);
    }
  };
  const selectRef = useRef(null);
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
        <div
          className="usa-select maxw-none"
          onClick={() => setActive(!active)}
          onKeyPress={() => setActive(!active)}
          role="button"
          tabIndex={0}
        >
          {t(`${selected.length} selected`)}
        </div>
        {active && (
          <ul className="easi-multiselect__options usa-list--unstyled padding-y-05 border-1px border-top-0 maxh-card overflow-scroll position-absolute right-0 left-0 z-top bg-white">
            {options.map(option => (
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
            ))}
          </ul>
        )}
      </div>
      <div className="easi-multiselect__selected-list margin-top-3">
        {t(selectedLabel)}
        {selected && (
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
        )}
      </div>
    </div>
  );
}
