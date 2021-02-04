import React from 'react';
import { shallow } from 'enzyme';

import FileUpload from './index';

describe('File Upload component', () => {
  it('renders without errors', () => {
    shallow(
      <FileUpload
        id="test-file-upload"
        name="test-file-upload"
        accept=".pdf"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
      />
    );
  });

  it('is disabled', () => {
    const component = shallow(
      <FileUpload
        id="test-file-upload"
        name="test-file-upload"
        accept=".pdf"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
        disabled
      />
    );

    expect(component.find('.usa-file-input--disabled').exists()).toEqual(true);
    expect(
      component.find('[data-testid="file-upload-wrapper"]').props()[
        'aria-disabled'
      ]
    ).toEqual(true);
    expect(
      component.find('[data-testid="file-upload-input"]').props().disabled
    ).toEqual(true);
  });

  describe('successfully upload file', () => {
    const component = shallow(
      <FileUpload
        id="test-file-upload"
        name="test-file-upload"
        accept=".pdf"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
        disabled
      />
    );

    component.find('[data-testid="file-upload-input"]').simulate('change', {
      target: {
        files: [
          {
            name: 'my-test-upload.pdf',
            type: 'application/pdf'
          }
        ]
      }
    });

    it('displays the uploaded file name', () => {
      expect(component.find('.usa-file-input__preview').text()).toContain(
        'my-test-upload.pdf'
      );
    });

    it('displays a file type icon', () => {
      expect(component.find('FileTypeIcon').exists()).toEqual(true);
    });

    it('allows user to change file', () => {
      expect(component.find('.usa-file-input__choose').exists()).toEqual(true);
    });

    it('hides instructions when a file is uploaded', () => {
      expect(
        component.find('.usa-file-input__instructions.display-none').exists()
      ).toEqual(true);
    });
  });

  describe('invalid file type', () => {
    const component = shallow(
      <FileUpload
        id="test-file-upload"
        name="test-file-upload"
        accept=".pdf"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
        disabled
      />
    );

    component.find('[data-testid="file-upload-input"]').simulate('change', {
      target: {
        files: [
          {
            name: 'not-allowed-image.png',
            type: 'image/png'
          }
        ]
      }
    });

    it('has errors for disallowed file type/extension', () => {
      expect(
        component.find('[data-testid="file-upload-input-error"]').exists()
      ).toEqual(true);
    });

    it('shows file upload instructions', () => {
      expect(component.find('.usa-file-input__instructions').exists()).toEqual(
        true
      );
    });

    it('does not show file preview elements when there is an error', () => {
      expect(component.find('.usa-file-input__preview').exists()).toEqual(
        false
      );
    });

    it('hides change file dialog', () => {
      expect(
        component.find('.usa-file-input__preview-heading').exists()
      ).toEqual(false);
    });
  });
});
