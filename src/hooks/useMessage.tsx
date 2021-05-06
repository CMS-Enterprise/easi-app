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

// MessageProvider manages the state necessary for child components to
// use the useMessage hook.
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

// useMessage is a hook that provides the ability to show notifications to the
// user. Components will use the hook to get access to two methods:
//
// showMessage: display a message to the user immediately. This is useful
// when an interaction won't cause an immediate redirect to a new page.
//
// showMessageOnNextPage: schedule a message to be shown on the next
// visited by the user. Pages are identified using their URL and therefore
// messages won't appear until the URL changes.
//
// Currently there is only support for showing a single message.
const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }

  return context;
};

export default useMessage;
export { useMessage, MessageProvider };
