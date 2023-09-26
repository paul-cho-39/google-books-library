import * as Yup from 'yup';

// change username -> name
export const Validate = (usernames: string[], emails: string[]) => {
   const validationSchemaSignUp = Yup.object().shape({
      username: Yup.string()
         .required('Username is required')
         .test('This username is available', 'Username already exists', (values, context) => {
            if (usernames.length <= 0) return true;
            if (usernames?.length) {
               return !usernames.includes(values as string);
            } else return false;
         })
         .min(4, 'Please enter a username that is at least 4 characters')
         .max(30, (object) => {
            `Please enter a username that is less than 30 characters (Username: (${object.value.length}))`;
         }),
      email: Yup.string()
         .test('is-available', 'Please enter a valid email', (values, context) => {
            if (emails.length <= 0) return true;
            if (values?.length) {
               return !emails?.includes(values);
            } else return false;
         })
         .required('Email is required')
         .email("Email must have '@' "),
      password: Yup.string()
         .required('Password is required')
         .min(7, 'Please enter a password that is at least 7 characters'),
   });
   return validationSchemaSignUp;
};

// validate if one of email or pw fails throw error.message
export const validateSignUp = () => {
   const validate = Yup.object().shape({
      email: Yup.string().required('Please enter the email in the signup form'),
      password: Yup.string().required('Please enter the password in the signup form'),
   });
   return validate;
};

export const validatePassword = () => {
   const validate = Yup.object().shape({
      password: Yup.string()
         .required('Please enter the new password')
         .min(7, 'Please enter a password that is at least 7 characters'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match'),
   });
   return validate;
};

// Yup .test() must have
// 1) a name 2) error message 3) validation function
// that returns true when the curren value is valid and
// false when invalid
