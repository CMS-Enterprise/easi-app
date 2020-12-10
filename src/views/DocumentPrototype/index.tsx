import React from 'react';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';

const DocumentPrototype = () => {
  return (
    <PageWrapper className="system-intake">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <h1>Document Prototype</h1>
      </MainContent>
    </PageWrapper>
  );
};

export default DocumentPrototype;
