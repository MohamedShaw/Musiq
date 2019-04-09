import * as yup from 'yup';
import I18n from 'react-native-i18n';

export const validationSchema = values =>
  yup.object().shape({
    email: yup
      .string()
      .required(I18n.t('signup-field-required'))
      .email(I18n.t('signup-email-invalid')),
    password: yup
      .string()
      .required(I18n.t('signup-field-required'))
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*-.])[A-Za-z\d$@$!%_*_#?&-_.]{8,}$/,
        I18n.t('signup-password-invalid'),
      ),
    username: yup.string().required(I18n.t('signup-field-required')),
    last_name: yup.string().required(I18n.t('signup-field-required')),
    first_name: yup.string().required(I18n.t('signup-field-required')),
  });
