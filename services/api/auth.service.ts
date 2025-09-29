import { Supabase } from "./utils";

type VercelENV = "production" | "development" | "preview";

export class AuthService extends Supabase {
    constructor() {
        super();
    }

    getAppURL() {
        const env = process.env.NEXT_PUBLIC_VERCEL_ENV as VercelENV;

        // Set default URL for localhost
        let url = "http://localhost:3000/";

        if (env === "preview") {
            // If it is a preview deployment, use the branch URL
            url = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ?? "";
        }

        if (env === "production") {
            // Use the production URL
            url = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "";
        }

        // Make sure to include `https://` when not localhost.
        url = url.includes("http") ? url : `https://${url}`;

        // Remove trailing `/`.
        url = url.endsWith("/") ? url.slice(0, -1) : url;
        return url;
    };

    async userSignUp(email: string, password_confirmation: string) {
        const { data, error } = await this.supabase.auth.signUp({
            email: email,
            password: password_confirmation,
        });

        if (error) {
            throw new Error(error.message)
        }

        return data
    }


    async reset_password(email: string) {
        const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${this.getAppURL()}/new-password`,
        });

        if (error) {

            throw new Error("An Error Occured")
        }

        return data
    }

    async change_authenticated_password(password: string) {
        const { data, error } = await this.supabase.auth.updateUser({
            password
        })

        if (error) {
            throw new Error("An Error Occured")
        }

        return data
    }

    async userLogin(email: string, password_confirmation: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password: password_confirmation });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async userLogout() {
        const { error } = await this.supabase.auth.signOut()

        if (error) {
            throw new Error(error.message)
        }

        return error;
    }
}