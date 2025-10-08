import { authClient } from "@/lib/auth-client"; //import the auth client
import { redirect } from "next/navigation";

export async function signUp(email, password, name, image) {
    await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        image, // User image URL (optional)
        callbackURL: "/" // A URL to redirect to after the user verifies their email (optional)
    }, {
        onRequest: (ctx) => {
            console.log(ctx);
        },
        onSuccess: () => {
            redirect("/");
        },
        onError: (ctx) => {
            alert(ctx.error.message);
        },
    });
}