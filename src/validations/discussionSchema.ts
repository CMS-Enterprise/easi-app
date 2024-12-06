import i18next from 'i18next';
import * as Yup from 'yup';

const discussionSchema = Yup.object().shape({
  content: Yup.string().required(i18next.t('form:inputError.fillBlank'))
});

export default discussionSchema;
