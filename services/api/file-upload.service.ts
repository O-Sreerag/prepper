import { generateUniqueFilename } from "@/lib/utils";
import { Supabase } from "./utils";

export class FileUploadService extends Supabase {
    constructor() {
        super();
    }

    private async checkAuth(): Promise<boolean> {
        const { session } = (await this.supabase.auth.getSession()).data;
        return !!session?.access_token;
    }

    private async ensureAuthenticated() {
        const isAuthenticated = await this.checkAuth();
        if (!isAuthenticated) {
            throw new Error("Authentication required. Please log in.");
        }
    }

    async uploadFile({ file, filename, bucket = "hrms-assets", folder }: { file: File, filename: string, bucket?: string, folder: string }) {
        await this.ensureAuthenticated()

        const uniqueName = generateUniqueFilename(filename);
        const filePath = `${folder}/${uniqueName}`;

        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(filePath, file, { upsert: true });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}
