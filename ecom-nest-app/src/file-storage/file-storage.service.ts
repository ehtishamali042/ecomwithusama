import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { v4 as uuidv4 } from "uuid";

export interface UploadOptions {
  bucket: "stock-images";
  userId: string;
  domain: "stock";
  entityId?: string;
  mimeType: string;
  originalName: string;
}

export interface UploadedFileResult {
  path: string;
  publicUrl: string;
}

@Injectable()
export class FileStorageService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Upload a file to Supabase Storage
   * @param buffer File buffer from Multer
   * @param options Upload configuration
   * @returns Object with storage path and public URL
   */
  async uploadFile(
    buffer: Buffer,
    options: UploadOptions,
  ): Promise<UploadedFileResult> {
    try {
      // Generate file extension from mime type or original name
      const extension = this.getFileExtension(
        options.mimeType,
        options.originalName,
      );

      // Generate unique filename
      const filename = `${uuidv4()}${extension}`;

      // Build storage path: user/{userId}/stock/{entityId}/{uuid.ext}
      const entityPart = options.entityId || "temp";
      const storagePath = `user/${options.userId}/${options.domain}/${entityPart}/${filename}`;

      const client = this.supabaseService.getClient();

      // Upload to Supabase Storage
      const { error: uploadError } = await client.storage
        .from(options.bucket)
        .upload(storagePath, buffer, {
          contentType: options.mimeType,
          upsert: false,
        });

      if (uploadError) {
        throw new InternalServerErrorException(
          `Failed to upload file: ${uploadError.message}`,
        );
      }

      // Get public URL
      const { data: urlData } = client.storage
        .from(options.bucket)
        .getPublicUrl(storagePath);

      if (!urlData?.publicUrl) {
        throw new InternalServerErrorException("Failed to generate public URL");
      }

      return {
        path: storagePath,
        publicUrl: urlData.publicUrl,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred during file upload",
      );
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @param bucket Storage bucket name
   * @param path File path in storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const client = this.supabaseService.getClient();
      const { error } = await client.storage.from(bucket).remove([path]);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to delete file: ${error.message}`,
        );
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred during file deletion",
      );
    }
  }

  /**
   * Extract file extension from mime type or filename
   */
  private getFileExtension(mimeType: string, originalName: string): string {
    // Try to get extension from mime type first
    const mimeExtensions: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/svg+xml": ".svg",
    };

    if (mimeExtensions[mimeType]) {
      return mimeExtensions[mimeType];
    }

    // Fallback to original filename extension
    const match = originalName.match(/\.[^.]+$/);
    return match ? match[0] : ".jpg"; // Default to .jpg
  }
}
