import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SupabaseAuthService } from "./supabase-auth.service";
import { SupabaseAuthGuard } from "./guards";

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthService, SupabaseAuthGuard],
  exports: [AuthService, SupabaseAuthService, SupabaseAuthGuard],
})
export class AuthModule {}
