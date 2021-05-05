import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';

const FlashContext = createContext<
  | {
      message: string;
      setMessage: (message: string) => void;
      setQueuedMessage: (message: string) => void;
    }
  | undefined
>(undefined);

const FlashProvider = ({ children }: { children: ReactNode }) => {
  const [queuedMessage, setQueuedMessage] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();

  const [lastPathname, setLastPathname] = useState(location.pathname);

  useEffect(() => {
    console.debug(lastPathname, location.pathname, queuedMessage, message);
    if (lastPathname !== location.pathname) {
      console.debug('shift');
      setMessage(queuedMessage);
      setQueuedMessage('');
      setLastPathname(location.pathname);
    }
  }, [message, queuedMessage, lastPathname, location.pathname]);

  return (
    <FlashContext.Provider value={{ message, setMessage, setQueuedMessage }}>
      {children}
    </FlashContext.Provider>
  );
};

const useFlash = () => {
  const context = useContext(FlashContext);
  if (context === undefined) {
    throw new Error('useFlash must be used within a FlashProvider');
  }

  return context;
};

export default useFlash;
export { useFlash, FlashProvider };
