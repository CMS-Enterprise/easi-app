import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import './i18n';

configure({ adapter: new Adapter() });
