import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

function useConfirmationText() {
  const location = useLocation<any>();
  const history = useHistory();
  const [confirmationText, setIsConfirmationText] = useState('');

  useEffect(() => {
    if (location.state && location.state.confirmationText) {
      setIsConfirmationText(location.state.confirmationText);
      history.replace({
        state: {}
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return confirmationText;
}

export default useConfirmationText;
