import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';

import Alert, { AlertProps } from 'components/Alert';

type MessageProps = {
  message?: string | React.ReactElement;
  alertProps?: Omit<AlertProps, 'children'>;
};

type SetMessage = (
  message?: string | React.ReactElement,
  alertProps?: Omit<AlertProps, 'children'>
) => void;

const MessageContext = createContext<
  | {
      Message: ({ className }: { className?: string }) => JSX.Element | null;
      showMessage: SetMessage;
      showMessageOnNextPage: SetMessage;
      errorMessageInModal: string | React.ReactNode | undefined;
      showErrorMessageInModal: (message: string | React.ReactNode) => void;
      clearMessage: () => void;
    }
  | undefined
>(undefined);

// MessageProvider manages the state necessary for child components to
// use the useMessage hook.
const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [queuedMessage, setQueuedMessage] = useState<MessageProps>({});
  const [message, setMessage] = useState<MessageProps>({});
  const [errorMessageInModal, setErrorMessageInModal] = useState<
    string | React.ReactNode
  >();

  const clearMessage = () => {
    setMessage({ message: '', alertProps: undefined });
    setErrorMessageInModal(undefined);
  };

  const location = useLocation();

  const [lastPathname, setLastPathname] = useState(location.pathname);

  const Message = (props: { className?: string }) => {
    // If no message, return null
    if (!message.message) return null;

    // If message has alert props, wrap in component
    if (message.alertProps) {
      return (
        <Alert {...message.alertProps} {...props}>
          {message.message}
        </Alert>
      );
    }

    // Return plain message
    return <>{message.message}</>;
  };

  useEffect(() => {
    if (lastPathname !== location.pathname) {
      setMessage(queuedMessage);
      setQueuedMessage({});
      setLastPathname(location.pathname);
    }
  }, [message, queuedMessage, lastPathname, location.pathname]);

  return (
    <MessageContext.Provider
      value={{
        Message,
        showMessage: (value, alertProps) =>
          setMessage({
            message: value,
            alertProps
          }),
        showMessageOnNextPage: (value, alertProps) =>
          setQueuedMessage({
            message: value,
            alertProps
          }),
        errorMessageInModal,
        showErrorMessageInModal: setErrorMessageInModal,
        clearMessage
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
