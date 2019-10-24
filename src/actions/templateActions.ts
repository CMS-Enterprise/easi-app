import { SEND_TEMPLATE } from 'constants/templateConstants';

// TODO: These interfaces may need to be exported into a separate file

interface Message {}

interface SendMessageAction {}

export default function sendTemplate(message: Message): SendMessageAction {
  return {
    tyoe: SEND_TEMPLATE,
    action: message
  };
}
