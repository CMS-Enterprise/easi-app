import debounce from 'lodash/debounce';
import { useEffect, useCallback, useRef } from 'react';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
};

const AutoSave = ({ values, onSave }: AutoSaveProps) => {
  const debounceSave = useCallback(debounce(onSave, 3000), [onSave]);
  const initialValues = useRef(values);

  useEffect(() => {
    // Don't save until values are changed from initial values (avoids save on initial render)
    if (initialValues.current === values) {
      return;
    }
    debounceSave();
  }, [debounceSave, values, onSave]);

  return null;
};

export default AutoSave;
