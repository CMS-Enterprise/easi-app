import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import './i18n';

configure({ adapter: new Adapter() });

// Fill in some missing functions that aren't shimmed by jsdom.
window.URL.createObjectURL = vi.fn();

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

window.scroll = vi.fn;
