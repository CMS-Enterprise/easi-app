import { configure } from 'enzyme';
import 'jest-canvas-mock';
import Adapter from 'enzyme-adapter-react-16';
import './i18n';

configure({ adapter: new Adapter() });
