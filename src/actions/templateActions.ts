// EXAMPLE - TO BE DELETED
import { SEND_TEMPLATE, UPDATE_DEMO_NAME } from 'constants/templateConstants';
import { DemoNameAction } from 'types/demoName';

interface Message {}

interface SendMessageAction {}

export function sendTemplate(message: Message): SendMessageAction {
  return {
    tyoe: SEND_TEMPLATE,
    payload: message
  };
}

export function updateDemoName(name: string): DemoNameAction {
  return {
    type: UPDATE_DEMO_NAME,
    payload: name
  };
}
