import * as Yup from 'yup';

export const uploadSchema = Yup.object().shape({
  file: Yup.mixed().required()
});

export default uploadSchema;
