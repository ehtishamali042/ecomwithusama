import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { FileStorageService } from "./file-storage.service";

@Module({
  imports: [SupabaseModule],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
