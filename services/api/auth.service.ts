import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { Supabase } from "./utils";

type MyTokenClaims = {
    role_ids?: string[];
    [key: string]: any;
};

type VercelENV = "production" | "development" | "preview";

export class AuthService extends Supabase {
    constructor() {
        super();
    }

    getAppURL() {
        const env = process.env.NEXT_PUBLIC_VERCEL_ENV as VercelENV;

        // Set default URL for localhost
        let url = "http://localhost:7000/";

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

    async verify_user_password(password: string) {
        const { data, error } = await this.supabase.rpc('verify_user_password', { password })

        if (error) {
            return false
        }

        return data
    }

    async reset_password(email: string) {
        const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${this.getAppURL()}/new-password`,
            // URL to handle password reset
        });

        if (error) {

            throw new Error("An Error Occured")
        }

        return data
    }


    async reset_lounge_admin_password(email: string) {

        const edgeFunctionUrl = 'https://fjlihsqbnpyfaiktbuyt.supabase.co/functions/v1/reset-user-password';
        const response = await axios.post(edgeFunctionUrl, {
            email
        })

        if (response.data.error) {
            throw new Error(response.data.error)
        }

        return response.data
    }

    async invite_user(email: string, password: string, mobileNumber: string, role: string | null, fullName: string, countryCode: string) {
        try {

            // Define the URL of your Supabase Edge Function
            const edgeFunctionUrl = 'https://fjlihsqbnpyfaiktbuyt.supabase.co/functions/v1/reset-link';

            // Send a POST request to the Edge Function
            const response = await axios.post(edgeFunctionUrl, {
                email,
                password,
                mobileNumber,
                country_code: countryCode,
                role: role,
                fullName
            });

            // Extract the data from the response
            const { data } = response;

            // If the response contains an error, throw it
            if (data.error) {
                throw new Error(data.error);
            }

            // Return the generated link or other relevant data
            return data;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error inviting user:', error);

            // Throw a generic error message or rethrow the error
            throw new Error('An error occurred while inviting the user');
        }
    }

    async get_all_users() {
        const { data, error } = await this.supabase.from('users').select('*').eq('user_type', 'CUSTOMER').order('created_at', { ascending: false })

        if (error) {
            throw new Error("An Error Occured")
        }

        return data
    }

    async get_user_id(id: string) {
        const { data, error } = await this.supabase.from('users').select('*').eq('id', id)

        if (error) {
            throw new Error("An Error Occured")
        }
        return data[0]
    }

    async check_user_exists(email: string) {
        const { data, error } = await this.supabase.from('users').select('*').eq('email', email)

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

    async change_password(password: string, accessToken: string) {
        const { error } = await this.supabase.auth.updateUser({
            password,

        });

        if (error) {
            throw new Error("An Error Occured")
        }
    }

    async userVerify(email: string) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)

        if (error) {
            return false
        }

        return data
    }

    async userLogin(email: string, password: string) {
        const result = await this.userVerify(email);

        if (!result) {
            throw new Error("invalid credentials");
        }

        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw new Error(error.message);
        }

        const { data: updateData, error: updateError } = await this.supabase.auth.updateUser({
            data: {
                platform: "HRMS"
            }
        });

        if (updateError) {
            throw new Error(updateError.message);
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

    async isUserActive() {
        const { session } = (await this.supabase.auth.getSession()).data

        return session
    }

    async getActiveUser() {
        const result = (await this.supabase.auth.getSession()).data

        return result
    }

    async getUserId() {
        const { session } = (await this.supabase.auth.getSession()).data
        return session?.user.id as string
    }

    async getTechnicalUsers() {
        const { data, error } = await this.supabase.from('technical_users').select('*')

        if (error) {
            throw new Error(error.message)
        }

        return data
    }

    async getUserDetails(id: string) {
        const { data, } = await this.supabase
            .from('users')
            .select('*')
            .eq('users_id', id)
            .single()
        return data
    }

    async getUserDetailsById(id: string) {
        const { data, } = await this.supabase
            .from('users')
            .select('*')
            .eq('users_id', id)
            .single()

        return data
    }

    async getCustomClaims() {
        const sessionRes = await this.supabase.auth.getSession();
        const accessToken = sessionRes.data.session?.access_token;

        if (!accessToken) {
            throw new Error("No access token found")
        }

        const decoded = jwtDecode(accessToken) as MyTokenClaims;

        return decoded;
    }
}

export const fetchUserActiveStatus = async () => {
    const service = new AuthService();
    const response = await service.getActiveUser();

    return response.session?.user;
};

export const fetchUserDetails = async () => {
    const service = new AuthService();

    const response = await service.getUserDetails((await service.getActiveUser()).session?.user.id!)

    return response
}