import { Session, User } from "better-auth";
import signIn from "./endpoints/sign-in";
import signUp from "./endpoints/sign-up";
import forgotPassword from "./endpoints/forgot-password";
import updatePassword from "./endpoints/update-password";
import sendEmailConfirmation from "./endpoints/send-email-confirmation";

export interface StrapiAuthOptions {
  strapiUrl: string;
  strapiToken?: string;
  userFieldsMap?: {
    [key: string]: any;
  };
  signInAfterReset?: boolean;
  sessionHook?: (session: {
    session: Session & Record<string, any>;
    user: User;
  }) => Promise<any> | any;
}

export const strapiAuth = (options: StrapiAuthOptions) => {
  return {
    id: "strapi-auth",
    endpoints: {
      signIn: signIn(options),
      signUp: signUp(options),
      forgotPassword: forgotPassword(options),
      updatePassword: updatePassword(options),
      sendEmailConfirmation: sendEmailConfirmation(options),
    },
  };
};

export type StrapiAuth = ReturnType<typeof strapiAuth>;
