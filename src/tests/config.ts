import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import '../config/i18n';

// Fill in some missing functions that aren't shimmed by jsdom.
window.URL.createObjectURL = vi.fn();

// Mock window.getComputedStyle for tests including rich text editor
const { getComputedStyle } = window;
window.getComputedStyle = elt => getComputedStyle(elt);

// Fill in some missing functions for the Toast text editor.
// These functions are triggered by typing interaction events on Toast's text field.

Range.prototype.getBoundingClientRect = () => ({
  x: 0,
  y: 0,
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  toJSON: () => {}
});

Range.prototype.getClientRects = () => ({
  item: () => null,
  length: 0,
  [Symbol.iterator]: vi.fn()
});

Document.prototype.elementFromPoint = (x: number, y: number) => null;

// Fill in some scroll functions
// Usually for alerts and form field attention
window.scroll = vi.fn();
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// Handle unhandled promise rejections from Apollo mutations in tests
// These are expected when testing error states with MockedProvider
// The global Apollo error handler will show toasts in production
// but MockedProvider doesn't include the global error link
process.on('unhandledRejection', (reason: any) => {
  // Log Apollo/GraphQL errors for debugging but don't fail tests
  if (reason?.networkError || reason?.graphQLErrors) {
    console.log(
      '[Test] Caught unhandled Apollo error (expected in error tests):',
      reason.message || reason
    );
  }
});
