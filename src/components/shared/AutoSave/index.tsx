import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
  debounceDelay: number;
};

const AutoSave = ({ values, onSave, debounceDelay }: AutoSaveProps) => {
  // We don't want autosave to to run on initial render because it can
  // potentially create an empty record or update nothing.
  // We also don't want to save when the component is unmounted, but a
  // save had already been invoked and pending the debounce delay.
  const isMounted = useRef(false);
  const debouncedSave = useCallback(
    debounce(() => {
      if (isMounted.current) {
        onSave();
      } else {
        isMounted.current = true;
      }
    }, debounceDelay),
    []
  );

  useEffect(() => {
    debouncedSave();
  }, [values, debouncedSave]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  return null;
};

export default AutoSave;
