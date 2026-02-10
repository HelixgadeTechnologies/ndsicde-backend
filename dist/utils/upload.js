"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.deleteFile = exports.removeFileExtension = exports.getFileName = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const secrets_1 = require("../secrets");
cloudinary_1.v2.config({
    cloud_name: secrets_1.CLOUD_NAME,
    api_key: secrets_1.CLOUDINARY_API_KEY,
    api_secret: secrets_1.CLOUDINARY_API_SECRET
});
const getFileName = (url) => {
    const parts = url.split("/");
    const folderIndex = parts.indexOf("upload") + 2;
    const path = parts.slice(folderIndex).join("/").replace(/\.[^/.]+$/, "");
    return path;
};
exports.getFileName = getFileName;
const removeFileExtension = (filePath) => {
    return filePath.replace(/\.[^/.]+$/, "");
};
exports.removeFileExtension = removeFileExtension;
const deleteFile = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!public_id) {
            throw new Error("public_id is required!");
        }
        const result = yield cloudinary_1.v2.uploader.destroy(public_id);
        if (result.result == "ok") {
            return true;
        }
        else {
            throw new Error(result.result);
        }
    }
    catch (error) {
        throw new Error("Error deleting file");
    }
});
exports.deleteFile = deleteFile;
const uploadFile = (data, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tempDir = path_1.default.join(__dirname, "../temp");
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        const uniqueName = crypto_1.default.randomBytes(8).toString("hex");
        const extension = type.split("/")[1] || "png";
        const fileName = `${uniqueName}.${extension}`;
        const filePath = path_1.default.join(tempDir, fileName);
        const buffer = Buffer.from(data, "base64");
        fs_1.default.writeFileSync(filePath, buffer);
        const result = yield cloudinary_1.v2.uploader.upload(filePath, {
            resource_type: "auto",
            folder: "ndsicde",
            public_id: uniqueName,
        });
        fs_1.default.unlinkSync(filePath);
        return result.secure_url;
    }
    catch (error) {
        throw new Error("Upload failed");
    }
});
exports.uploadFile = uploadFile;
