import { AxiosError, AxiosResponse } from "axios";
import { createBrowserClient } from "@supabase/ssr";

const CLIENT_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLIENT_SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export class BuildUrl {
    supabase(endpoint: string) {
        const url = "https://fjlihsqbnpyfaiktbuyt.supabase.co/functions/v1";
        return url + endpoint;
    }
}

export class Supabase {
    private readonly supabaseUrl;
    private readonly supabaseKey;
    protected readonly supabase;

    constructor() {
        this.supabaseUrl = CLIENT_SUPABASE_URL!;
        this.supabaseKey = CLIENT_SUPABASE_KEY!;
        
        // Client-side initialization only
        this.supabase = createBrowserClient(this.supabaseUrl, this.supabaseKey);
        
        return this;
    }
}

export type IResponse = {
    message: string;
    data?: unknown;
};

export function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since January is month 0
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export type IUserType = {
    age: number;
    bio: string;
    birth_date: string | null;
    created_at: string;
    district: string;
    email: string;
    gender: string;
    id: string;
    image: string | null;
    langs: string[];
    name: string;
    passion: string[];
    phone_number: string;
    tag_name: string | null;
    user_name: string;
    user_type: string;
}

export function adaptSuccessResponse(response: AxiosResponse): IResponse {
    return {
        message: response?.data?.message || "Success",
        data: response?.data?.data,
    };
}

export function adaptErrorResponse(
    error: AxiosError<{ message?: string }>
): string {
    return error?.response?.data?.message || "Error";
}
