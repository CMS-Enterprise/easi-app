import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { useEffect, useCallback } from 'react';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
  debounceDelay: number;
  lastSavedValues: any;
};

const AutoSave = ({
  values,
  onSave,
  debounceDelay,
  lastSavedValues
}: AutoSaveProps) => {
  const debounceSave = useCallback(debounce(onSave, debounceDelay), [
    onSave,
    debounceDelay
  ]);

  useEffect(() => {
    // Don't save until values are changed from initial values (avoids save on initial render)
    if (isEqual(lastSavedValues, values)) {
      return;
    }
    console.log(lastSavedValues, values);
    debounceSave();
  }, [values]);

  return null;
};

export default AutoSave;
