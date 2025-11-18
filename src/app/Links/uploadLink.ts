import { createUploadLink } from 'apollo-upload-client';

import graphqlAddress from 'constants/graphqlURLs';

const uploadLink = createUploadLink({
  uri: graphqlAddress
});

export default uploadLink;
