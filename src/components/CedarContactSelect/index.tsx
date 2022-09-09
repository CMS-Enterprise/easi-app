import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, {
  components,
  IndicatorsContainerProps,
  InputProps,
  MenuProps,
  OptionProps
} from 'react-select';
import { IconWarning } from '@trussworks/react-uswds';
import classNames from 'classnames';

import useCedarContactLookup from 'hooks/useCedarContactLookup';
import { CedarContactProps } from 'types/systemIntake';
import color from 'utils/uswdsColor';

import '@reach/combobox/styles.css';
import './index.scss';

type CedarContactSelectProps = {
  className?: string;
  id: string;
  name: string;
  ariaDescribedBy?: string;
  value?: CedarContactProps;
  onChange: (contact: CedarContactProps | null) => void;
  disabled?: boolean;
  autoSearch?: boolean;
};

type CedarContactSelectOption = {
  value: CedarContactProps;
  label: string;
};

// Override React Select input to fix hidden input on select bug
const Input = (props: InputProps<CedarContactSelectOption, false>) => {
  // console.log(props.selectProps.isLoading);
  return <components.Input {...props} isHidden={false} />;
};

// Custom option component
const Option = (props: OptionProps<CedarContactSelectOption, false>) => {
  const { isFocused } = props;
  return (
    <components.Option
      {...props}
      className={classNames('usa-combo-box__list-option', {
        'usa-combo-box__list-option--focused': isFocused
      })}
    />
  );
};

const Menu = (props: MenuProps<CedarContactSelectOption, false>) => {
  const {
    selectProps: { inputValue }
  } = props;
  if (inputValue.length < 2) return null;
  return <components.Menu {...props} />;
};

const IndicatorsContainer = (
  props: IndicatorsContainerProps<CedarContactSelectOption, false>
) => {
  const {
    children,
    selectProps: { className }
  } = props;
  return (
    <components.IndicatorsContainer {...props}>
      {className!.split(' ').includes('cedar-contact-select__warning') && (
        <IconWarning className="text-warning margin-right-105" size={3} />
      )}
      {children}
    </components.IndicatorsContainer>
  );
};

export default function CedarContactSelect2({
  className,
  id,
  name,
  ariaDescribedBy,
  value,
  onChange,
  disabled,
  autoSearch
}: CedarContactSelectProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string | null>(
    autoSearch ? value?.commonName! : null
  );
  const [contacts, getCedarContacts] = useCedarContactLookup();
  const selectedContact = useRef(value?.euaUserId);

  // Whether to show warning icon in input
  const showWarning = autoSearch && !value?.euaUserId && contacts.length !== 1;

  /** Formatted contact label */
  const formattedContact = value
    ? `${value?.commonName}${value?.euaUserId && `, ${value?.euaUserId}`}`
    : '';

  /** Update contact and reset search term */
  const updateContact = (contact: CedarContactProps | null) => {
    onChange(contact);
    selectedContact.current = contact?.euaUserId;
    setSearchTerm(null);
  };

  // React Select styles object
  const customStyles: {
    [index: string]: (
      provided: CSSProperties,
      state: { isFocused: boolean }
    ) => CSSProperties;
  } = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
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
      color: color('base-dark'),
      padding: '8px 6px',
      '&:hover': {
        color: color('base-dark'),
        cursor: 'pointer'
      },
      '> svg': {
        width: '22px',
        height: '22px'
      }
    }),
    clearIndicator: provided => ({
      ...provided,
      color: color('base-dark'),
      padding: '8px 6px',
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
      marginTop: '8px',
      marginBottom: '8px'
    }),
    menu: provided => ({
      ...provided,
      marginTop: '0px',
      borderRadius: 0,
      border: `1px solid ${color('base-dark')}`,
      borderTop: 'none',
      boxShadow: 'none'
    }),
    menuList: provided => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0
    }),
    noOptionsMessage: provided => ({
      ...provided,
      textAlign: 'left'
    }),
    input: provided => ({
      ...provided,
      visibility: 'visible'
    }),
    option: provided => ({
      ...provided,
      backgroundColor: 'transparent'
    })
  };

  // Update contacts when search term changes
  useEffect(() => {
    if (searchTerm) getCedarContacts(searchTerm);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update contact when value changes
  useEffect(() => {
    if (value && value?.euaUserId !== selectedContact.current) {
      updateContact(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Select
      id={id}
      name={name}
      className={classNames(
        'cedar-contact-select',
        'usa-combo-box',
        { 'cedar-contact-select__warning': showWarning },
        { 'opacity-70': disabled },
        className
      )}
      isDisabled={disabled}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      aria-label="Cedar-Users"
      components={{ Input, IndicatorsContainer, Option, Menu }}
      options={contacts.map(contact => ({
        label: `${contact.commonName}, ${contact.euaUserId}`,
        value: contact
      }))}
      styles={customStyles}
      value={value ? { value, label: formattedContact } : undefined}
      inputValue={searchTerm ?? formattedContact}
      onChange={item => updateContact(item?.value || null)}
      onBlur={() => {
        // Automatically select on blur if search returns single result
        if (autoSearch && contacts.length === 1) updateContact(contacts[0]);
      }}
      onMenuOpen={() => {
        // If contact is selected, show as option on open
        if (!searchTerm && formattedContact) setSearchTerm(formattedContact);
      }}
      onInputChange={(newValue, { action }) => {
        if (action !== 'input-blur' && action !== 'menu-close')
          setSearchTerm(newValue);
      }}
      controlShouldRenderValue={!!searchTerm}
      noOptionsMessage={() => t('No results')}
      classNamePrefix="cedar-contact-select"
      instanceId={id}
      placeholder={false}
      isSearchable
      isClearable
    />
  );
}
