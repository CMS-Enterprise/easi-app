import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';

const MessageContext = createContext<
  | {
      message: string | undefined;
      showMessage: (message: string) => void;
      showMessageOnNextPage: (message: string) => void;
    }
  | undefined
>(undefined);

const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [queuedMessage, showMessageOnNextPage] = useState<string>();
  const [message, showMessage] = useState<string>();
  const location = useLocation();

  const [lastPathname, setLastPathname] = useState(location.pathname);

  useEffect(() => {
    if (lastPathname !== location.pathname) {
      showMessage(queuedMessage);
      showMessageOnNextPage('');
      setLastPathname(location.pathname);
    }
  }, [message, queuedMessage, lastPathname, location.pathname]);

  return (
    <MessageContext.Provider
      value={{
        message,
        showMessage,
        showMessageOnNextPage
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }

  return context;
};

export default useMessage;
export { useMessage, MessageProvider };
