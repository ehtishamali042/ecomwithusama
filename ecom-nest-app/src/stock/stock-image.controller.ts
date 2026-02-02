import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileStorageService } from "../file-storage/file-storage.service";
import { SupabaseAuthGuard } from "../auth/guards/supabase-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { v4 as uuidv4 } from "uuid";

@Controller("stocks")
@UseGuards(SupabaseAuthGuard)
export class StockImageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  /**
   * Upload a stock image and return its storage path and public URL
   * POST /stocks/upload-image
   */
  @Post("upload-image")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  async uploadStockImage(
    @CurrentUser() user: any,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    if (!file) {
      return { error: "No file uploaded" };
    }
    // Optionally accept stockId as query param for updates
    const stockId = req.query.stockId || uuidv4();
    const result = await this.fileStorageService.uploadFile(file.buffer, {
      bucket: "stock-images",
      userId: user.id,
      domain: "stock",
      entityId: stockId,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });
    return result;
  }
}
