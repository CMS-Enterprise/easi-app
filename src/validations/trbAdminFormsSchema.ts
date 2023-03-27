import * as yup from 'yup';

import { TRBAdminNoteCategory } from 'types/graphql-global-types';

const adminNotesSchema = yup.object({
  category: yup
    .mixed<TRBAdminNoteCategory>()
    .oneOf(Object.values(TRBAdminNoteCategory))
    .required(),
  noteText: yup.string().required()
});

export default adminNotesSchema;
