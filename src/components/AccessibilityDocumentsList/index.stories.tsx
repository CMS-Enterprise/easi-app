import React from 'react';
import { DateTime } from 'luxon';

import {
  AccessibilityRequestDocumentCommonType,
  AccessibilityRequestDocumentStatus
} from 'types/graphql-global-types';

import AccessibilityDocumentsList from './index';

export default {
  title: 'Accessibility Documents List',
  component: AccessibilityDocumentsList
};

export const Default = () => {
  const documents = [
    {
      name: 'Document 1',
      status: AccessibilityRequestDocumentStatus.AVAILABLE,
      uploadedAt: DateTime.local().toString(),
      url: 'https://example.com/document.pdf',
      documentType: {
        commonType: AccessibilityRequestDocumentCommonType.AWARDED_VPAT,
        otherTypeDescription: ''
      }
    },
    {
      name: 'Document 2',
      status: AccessibilityRequestDocumentStatus.UNAVAILABLE,
      uploadedAt: DateTime.local().toString(),
      url: 'https://example.com/document.pdf',
      documentType: {
        commonType: AccessibilityRequestDocumentCommonType.REMEDIATION_PLAN,
        otherTypeDescription: ''
      }
    },
    {
      name: 'Document 3',
      status: AccessibilityRequestDocumentStatus.PENDING,
      uploadedAt: DateTime.local().toString(),
      url: 'https://example.com/document.pdf',
      documentType: {
        commonType: AccessibilityRequestDocumentCommonType.OTHER,
        otherTypeDescription: 'My Other Document'
      }
    }
  ];
  return (
    <AccessibilityDocumentsList
      documents={documents}
      requestName="Request Name"
      removeDocument={() => {}}
    />
  );
};
