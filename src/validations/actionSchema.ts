import * as Yup from 'yup';

export const actionSchema = Yup.object().shape({
  feedback: Yup.string().required('Please fill out email')
});

export const lifecycleIdSchema = Yup.object().shape({
  lifecycleId: Yup.string()
    .nullable()
    .length(7),
  expirationDateDay: Yup.string()
    .length(2)
    .required('Please include a day'),
  expirationDateMonth: Yup.string()
    .length(2)
    .required('Please include a month'),
  expirationDateYear: Yup.string()
    .length(4)
    .required('Please include a year'),
  scope: Yup.string().required('Please include a scope'),
  nextSteps: Yup.string(),
  feedback: Yup.string().required('Please fill out email')
});
