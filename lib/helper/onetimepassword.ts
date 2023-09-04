import { SignInForm } from "../types/formInputsWithChildren";

export const getDataApiUrl = (data: SignInForm) => {
  let url;
  // can it be better by using switch & case?
  data.lastName ||
    (data.firstName &&
      data.lastName &&
      data.firstName &&
      (url = `/api/user-settings/names`));
  data.email && (url = `/api/user-settings/email`);
  data.password &&
    data.newPassword &&
    data.confirmPassword &&
    (url = `/api/user-settings/changePassword`);

  return url;
};

// 1) get the user id and select date
// 2) if the select is null
// 3) then call an api route where if clicked then send verification email
// 4) and the end route should be the same route as api calls
