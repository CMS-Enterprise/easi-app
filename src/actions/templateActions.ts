import { SEND_TEMPLATE, UPDATE_DEMO_NAME } from 'constants/templateConstants';
import { DemoNameAction } from 'types/demoName';

// TODO: These interfaces may need to be exported into a separate file

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
