import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto, UpdateSettingsDto } from "./dto";
import { SupabaseAuthGuard } from "../auth/guards";
import { CurrentUser } from "../common/decorators";
import { User } from "@supabase/supabase-js";

@Controller("profile")
@UseGuards(SupabaseAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@CurrentUser() user: User) {
    return this.profileService.getProfile(user.id);
  }

  @Patch()
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user.id, dto);
  }

  @Get("settings")
  async getSettings(@CurrentUser() user: User) {
    return this.profileService.getSettings(user.id);
  }

  @Patch("settings")
  async updateSettings(
    @CurrentUser() user: User,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.profileService.updateSettings(user.id, dto);
  }
}
