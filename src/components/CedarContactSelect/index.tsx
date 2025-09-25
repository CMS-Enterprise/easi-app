import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { RefCallBack } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select, {
  ClearIndicatorProps,
  components,
  IndicatorsContainerProps,
  InputProps,
  MenuProps,
  OptionProps,
  SingleValue
} from 'react-select';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Spinner from 'components/Spinner';
import useOktaUserLookup from 'hooks/useOktaUserLookup';
import { OktaUserProps } from 'types/systemIntake';
import color from 'utils/uswdsColor';

import './index.scss';

type OktaUserSelectProps = {
  className?: string;
  id: string;
  name: string;
  ariaDescribedBy?: string;
  value?: OktaUserProps | null;
  onChange: (contact: OktaUserProps | null) => void;
  disabled?: boolean;
  autoSearch?: boolean;
  inputRef?: RefCallBack;
};

type OktaUserSelectOption = {
  value: OktaUserProps;
  label: string;
};

// Override React Select input to fix hidden input on select bug
const Input = (props: InputProps<OktaUserSelectOption, false>) => {
  return (
    <components.Input
      {...props}
      isHidden={false}
      data-testid="okta-user-select"
    />
  );
};

// Custom option component
const Option = (props: OptionProps<OktaUserSelectOption, false>) => {
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

const Menu = (props: MenuProps<OktaUserSelectOption, false>) => {
  const {
    selectProps: { inputValue }
  } = props;
  if (inputValue.length < 2) return null;
  return <components.Menu {...props} />;
};

const ClearIndicator = (
  props: ClearIndicatorProps<OktaUserSelectOption, false>
) => {
  const {
    selectProps: { inputValue }
  } = props;
  // Fix bug in 'same as requester' checkboxes where clear indicator shows with no input value
  if (!inputValue) return null;
  return <components.ClearIndicator {...props} />;
};

const IndicatorsContainer = (
  props: IndicatorsContainerProps<OktaUserSelectOption, false>
) => {
  const {
    children,
    selectProps: { className, isDisabled },
    hasValue
  } = props;

  // Whether to show spinner based on className
  const loading = className!.split(' ').includes('okta-user-select__loading');
  // Whether to show warning icon based in className
  const resultsWarning =
    hasValue && className!.split(' ').includes('okta-user-select__warning');

  // Hide indicators if field is disabled
  if (isDisabled) return null;

  return (
    <components.IndicatorsContainer {...props}>
      {!loading && resultsWarning && (
        <Icon.Warning aria-hidden className="text-warning" size={3} />
      )}
      {loading && <Spinner size="small" />}
      {children}
    </components.IndicatorsContainer>
  );
};

/** Format contact label to include name, EUA, and email */
const formatContactLabel = (contact: OktaUserProps) => {
  const { commonName, euaUserId, email } = contact;
  return `${commonName}${euaUserId && `, ${euaUserId}`}${
    email ? ` (${email})` : ''
  }`;
};

/**
 * Combobox to look up contact by name from OKTA
 */
export default function OktaUserSelect({
  className,
  id,
  name,
  ariaDescribedBy,
  value,
  onChange,
  disabled,
  autoSearch,
  inputRef
}: OktaUserSelectProps) {
  const { t } = useTranslation();

  // If autoSearch, set name as initial search term
  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    value?.commonName ? formatContactLabel(value) : undefined
  );

  // If autoSearch, run initial query from name
  const { contacts, queryOktaUsers, loading } = useOktaUserLookup(searchTerm);

  // Selected contact
  const selectedContact = useRef(value?.euaUserId);

  /** Field should only autoSearch if initial commonName was provided */
  const shouldAutoSearch = useMemo(
    () => autoSearch && value?.commonName,
    [autoSearch, value?.commonName]
  );

  // Show warning if autosearch returns multiple or no results
  const showWarning =
    shouldAutoSearch && !value?.euaUserId && contacts.length !== 1;

  /** Query OKTA by common name and update contacts */
  const queryContacts = useCallback(
    (query: string) => {
      setSearchTerm(query);
      if (query.length > 1) {
        queryOktaUsers(query.split(',')[0]);
      }
    },
    [queryOktaUsers]
  );

  /** Update contact and reset search term */
  const updateContact = useCallback(
    (contact?: OktaUserProps | null) => {
      onChange(contact || null);
      selectedContact.current = contact?.euaUserId;
      queryContacts(contact ? formatContactLabel(contact) : '');
    },
    [onChange, queryContacts]
  );

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
      backgroundColor: 'transparent',
      color: 'inherit'
    })
  };

  // Update contact when value changes
  // Fix for 'same as requester' checkboxes in system intake form
  useEffect(() => {
    if (shouldAutoSearch && value?.euaUserId !== selectedContact.current) {
      updateContact(value);
    }
  }, [value, contacts, updateContact, shouldAutoSearch]);

  // Update contact with first result after autoSearch on initial render
  useEffect(() => {
    if (shouldAutoSearch && contacts.length === 1 && !selectedContact.current) {
      updateContact(contacts[0]);
    }
  }, [shouldAutoSearch, contacts, updateContact]);

  return (
    <Select
      id={id}
      name={name}
      className={classNames(
        'margin-top-1',
        'okta-user-select',
        'usa-combo-box',
        'maxw-none',
        { 'okta-user-select__warning': showWarning },
        { 'okta-user-select__loading': loading },
        { 'opacity-70': disabled },
        className
      )}
      isDisabled={disabled}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      components={{ Input, IndicatorsContainer, ClearIndicator, Option, Menu }}
      options={contacts.map(contact => ({
        label: formatContactLabel(contact),
        value: contact
      }))}
      styles={customStyles}
      defaultValue={
        value
          ? {
              value,
              label: formatContactLabel(value)
            }
          : undefined
      }
      value={
        value
          ? {
              value,
              label: formatContactLabel(value)
            }
          : undefined
      }
      onChange={(newValue: SingleValue<OktaUserSelectOption>) =>
        updateContact(newValue?.value || null)
      }
      onBlur={() => {
        // Automatically select on blur if search returns single result
        if (shouldAutoSearch && contacts.length === 1) {
          updateContact(contacts[0]);
        }
      }}
      onInputChange={(newValue: string, { action }: { action: string }) => {
        if (action !== 'input-blur' && action !== 'menu-close') {
          queryContacts(newValue);
        }
      }}
      defaultInputValue={searchTerm}
      inputValue={searchTerm}
      noOptionsMessage={() => t('No results')}
      classNamePrefix="okta-user-select"
      instanceId={id}
      placeholder={false}
      backspaceRemovesValue={false}
      controlShouldRenderValue={false}
      ref={inputRef}
      isSearchable
      isClearable
    />
  );
}
