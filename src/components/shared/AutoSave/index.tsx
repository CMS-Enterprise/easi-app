import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
  debounceDelay: number;
};

const AutoSave = ({ values, onSave, debounceDelay }: AutoSaveProps) => {
  // We also don't want to save when the component is unmounted, but a
  // save had already been invoked and pending the debounce delay.
  const isMounted = useRef(false);
  const debouncedSave = useMemo(() => {
    return debounce(() => {
      // We also don't want to save when the component is unmounted, but a
      // debounceSave had already been invoked and ispending the debounce delay.
      if (isMounted.current) {
        onSave(values);
      }
    }, debounceDelay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // We don't want autosave to to run on initial render because it can
    // potentially create an empty record or update nothing.
    if (isMounted.current) {
      debouncedSave();
    } else {
      isMounted.current = true;
    }
  }, [values, debouncedSave]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  return null;
};

export default AutoSave;
