import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Flags, FlagsState } from 'types/flags';

const initialState: FlagsState = {
  flags: {
    taskListLite: false,
    sandbox: false
  },
  isLoaded: false
};

const FlagContext = React.createContext(initialState);

type FlagProviderProps = {
  children: React.ReactNode;
};

export const FlagProvider = ({ children }: FlagProviderProps) => {
  const [flagState, setFlagState] = useState(initialState);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ADDRESS}/flags`
        );
        setFlagState({ flags: response.data, isLoaded: true });
      } catch (error) {
        setFlagState(state => ({ ...state, isLoaded: true }));
        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-console
          console.error(`Failed to load flags! #{response}`);
        }
      }
    };

    fetchFlags();
  }, []);

  return (
    <FlagContext.Provider value={flagState}>
      {flagState.isLoaded ? children : null}
    </FlagContext.Provider>
  );
};

export const useFlags = () => {
  const context = React.useContext(FlagContext);
  if (context === undefined) {
    return initialState.flags;
  }
  return context.flags;
};

type FlagToggleProps = {
  children: React.ReactNode;
  name: keyof Flags;
};

// Use FlagToggle to wrap a component that should conditionally appear based on
// the value of a flag:
//
// <FlagToggle name="sandbox"><Sandbox /></FlagToggle>
//
// This will only render the <Sandbox> component if the "sandbox" flag has a truthy value.
export const FlagToggle = ({ children, name }: FlagToggleProps) => {
  const { flags } = React.useContext(FlagContext) || initialState;
  return <>{flags[name] ? children : null}</>;
};
