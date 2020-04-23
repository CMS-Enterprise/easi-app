import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { useEffect, useCallback, useRef } from 'react';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
  debounceDelay: number;
};

const AutoSave = ({ values, onSave, debounceDelay }: AutoSaveProps) => {
  const debounceSave = useCallback(debounce(onSave, debounceDelay), [
    onSave,
    debounceDelay
  ]);
  const initialValues = useRef(values);

  useEffect(() => {
    // Don't save until values are changed from initial values (avoids save on initial render)
    if (isEqual(initialValues.current, values)) {
      return;
    }
    debounceSave();
  }, [debounceSave, values]);

  return null;
};

export default AutoSave;
