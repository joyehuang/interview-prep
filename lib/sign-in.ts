import { authClient } from "./auth-client";

export async function signIn(email, password) {
  await authClient.signIn.email(
    {
      /**
       * The user email
       */
      email,
      /**
       * The user password
       */
      password,
      /**
       * A URL to redirect to after the user verifies their email (optional)
       */
      callbackURL: "/dashboard",
      /**
       * remember the user session after the browser is closed.
       * @default true
       */
      rememberMe: false,
    },
    {
      //callbacks
    }
  );
}
