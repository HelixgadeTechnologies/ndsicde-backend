import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../secrets';

// Configuration
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});


export const getFileName = (url: string) => {
    const parts = url.split("/");
    const folderIndex = parts.indexOf("upload") + 2; // Skip "upload" and version number
    const path = parts.slice(folderIndex).join("/").replace(/\.[^/.]+$/, ""); // Remove extension
    return path;
}
export const removeFileExtension = (filePath: string): string => {
    return filePath.replace(/\.[^/.]+$/, ""); // Removes the last extension
}

export const deleteFile = async (public_id: string): Promise<boolean> => {
    try {
        if (!public_id) {
            throw new Error("public_id is required!");
        }

        // Call Cloudinary to delete the file
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result == "ok") {
            return true
        } else {
            throw new Error(result.result);
        }
    } catch (error) {
        throw new Error("Error deleting file");
    }
}
export const uploadFile = async (data: string, type: string): Promise<string> => {

    try {
        // Ensure temp directory exists
        const tempDir = path.join(__dirname, "../temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Generate a unique filename
        const uniqueName = crypto.randomBytes(8).toString("hex"); // Generates a random name
        const extension = type.split("/")[1] || "png"; // Extract extension from MIME type
        const fileName = `${uniqueName}.${extension}`;
        const filePath = path.join(tempDir, fileName); // Absolute path


        // Convert Base64 to Buffer & Save as File
        const buffer = Buffer.from(data, "base64");
        fs.writeFileSync(filePath, buffer);

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            folder: "ndsicde",
            public_id: uniqueName, // Use filename as public_id
        });

        // Delete temp file after upload
        fs.unlinkSync(filePath);

        // Return Cloudinary URL
        return result.secure_url;
    } catch (error) {
        throw new Error("Upload failed");
    }
}
