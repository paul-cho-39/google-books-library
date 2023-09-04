import * as Yup from "yup";

export const changeEmail = () => {
  const validate = Yup.object().shape({
    email: Yup.string().required("Please fill out the email").email(),
  });
  return validate;
};

export const changeNames = () => {
  const validate = Yup.object().shape({
    firstName: Yup.string().min(2).max(20),
    lastName: Yup.string().min(1).max(20),
  });
  return validate;
};

export const changePassword = () => {
  const validate = Yup.object().shape({
    password: Yup.string().required(
      "Enter the correct current password to change the password"
    ),
    newPassword: Yup.string()
      .required("Please enter the new password")
      .notOneOf(
        [Yup.ref("password")],
        "Enter a password different from the old one"
      )
      .min(7, "Please enter a password that is at least 7 characters"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Password must match"
    ),
  });
  return validate;
};
