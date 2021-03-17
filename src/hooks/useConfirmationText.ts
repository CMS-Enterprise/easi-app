import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// useConfirmationText is a hook used to get the confirmation text
// passed through react router state.
// const confirmationText = useConfirmationText();
//
// Two common ways to pass state through react-router (there are more)
// history.push('/some/url', { confirmationText: 'Confirmed' });
// or
// const location = { pathname: '/some/url', state: { confirmationText: 'Confirmed' }};
// <Link to={location} />
function useConfirmationText() {
  const location = useLocation<any>();
  const history = useHistory();
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    if (location.state && location.state.confirmationText) {
      setConfirmationText(location.state.confirmationText);
      history.replace({
        state: {}
      });
    }

    // unset confirmationText if it's null
    if (!location.state?.confirmationText) {
      setConfirmationText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);

  return confirmationText;
}

export default useConfirmationText;
