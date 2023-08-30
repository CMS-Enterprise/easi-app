import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

// import configureMockStore from 'redux-mock-store';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
// import 'jest-canvas-mock';
import 'vitest-canvas-mock';
import './i18n';

configure({ adapter: new Adapter() });

window.URL.createObjectURL = vi.fn();

// https://stackoverflow.com/questions/56079277/okta-sign-in-widget-breaks-jest-tests-typeerror-cannot-read-property-backing
window.getComputedStyle = vi.fn(() => {
  return ({
    getPropertyValue: vi.fn()
  } as unknown) as CSSStyleDeclaration;
});

// https://github.com/hustcc/jest-canvas-mock/issues/2
global.HTMLCanvasElement.prototype.getContext = () => null;
global.URL.createObjectURL = () => '';

document.querySelector = vi.fn(() => {
  return {
    offsetWidth: 0,
    scrollIntoView: vi.fn()
  };
});

// vi.stubGlobal('mockStore', configureMockStore());
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
  [Symbol.iterator]: jest.fn()
});

Document.prototype.elementFromPoint = (x: number, y: number) => null;
