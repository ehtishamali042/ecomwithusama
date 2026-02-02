import { Module } from "@nestjs/common";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { StockImageController } from "./stock-image.controller";
import { FileStorageModule } from "../file-storage/file-storage.module";
import { SupabaseModule } from "../supabase/supabase.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [SupabaseModule, FileStorageModule, AuthModule],
  controllers: [StockController, StockImageController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
