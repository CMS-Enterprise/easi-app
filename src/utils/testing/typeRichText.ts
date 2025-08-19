import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Type interaction for Toast's rich text editor.
 * Wrap as async event so that toast's state changes are propagated.
 * Works in tandem with some mock functions provided for Toast in `src/setupTests.ts`
 */
export default async function typeRichText(
  element: HTMLElement,
  content: string
) {
  return act(async () => {
    const user = userEvent.setup();
    await user.type(element, content);
  });
}
