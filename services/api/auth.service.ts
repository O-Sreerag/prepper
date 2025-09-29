import { Supabase } from "./utils";

export class AuthService extends Supabase {
    constructor() {
        super();
    }

    async signUp(fullName: string, email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async userLogin(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async forgotPassword(email: string) {
        const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async resetPassword(newPassword: string) {
        const { data, error } = await this.supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async userLogout() {
        const { error } = await this.supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

        return error;
    }

    async getActiveUser() {
        const { data, error } = await this.supabase.auth.getSession();

        if (error) {
            throw new Error(error.message);
        }

        return data.session;
    }
}
