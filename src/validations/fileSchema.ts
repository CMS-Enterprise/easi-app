import * as Yup from 'yup';

export const uploadSchema = Yup.object().shape({
  file: Yup.mixed().required()
});

export const fileObjectSchema = Yup.object({
  name: Yup.string().required(),
  size: Yup.number().min(0).required(),
  type: Yup.string().required()
});

export default uploadSchema;
