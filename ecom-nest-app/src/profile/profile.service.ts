import { Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { UpdateProfileDto, UpdateSettingsDto } from "./dto";

export interface Profile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  defaultProfitMarginPercent?: number;
  preferredMarketplace?: "AMAZON" | "EBAY";
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ProfileService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfile(userId: string): Promise<Profile> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new NotFoundException("Profile not found");
    }

    return this.formatProfile(data);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const supabase = this.supabaseService.getClient();

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (dto.firstName !== undefined) {
      updateData.first_name = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      updateData.last_name = dto.lastName;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException("Profile not found");
    }

    return this.formatProfile(data);
  }

  async getSettings(userId: string): Promise<UserSettings> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // No settings found, create default settings
      return this.createDefaultSettings(userId);
    }

    if (error || !data) {
      throw new NotFoundException("Settings not found");
    }

    return this.formatSettings(data);
  }

  async updateSettings(
    userId: string,
    dto: UpdateSettingsDto,
  ): Promise<UserSettings> {
    const supabase = this.supabaseService.getClient();

    // First, ensure settings exist
    await this.getSettings(userId);

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (dto.defaultProfitMarginPercent !== undefined) {
      updateData.default_profit_margin_percent = dto.defaultProfitMarginPercent;
    }
    if (dto.preferredMarketplace !== undefined) {
      updateData.preferred_marketplace = dto.preferredMarketplace;
    }

    const { data, error } = await supabase
      .from("user_settings")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException("Settings not found");
    }

    return this.formatSettings(data);
  }

  private async createDefaultSettings(userId: string): Promise<UserSettings> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from("user_settings")
      .insert({ user_id: userId })
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException("Failed to create settings");
    }

    return this.formatSettings(data);
  }

  private formatProfile(data: any): Profile {
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private formatSettings(data: any): UserSettings {
    return {
      id: data.id,
      userId: data.user_id,
      defaultProfitMarginPercent: data.default_profit_margin_percent,
      preferredMarketplace: data.preferred_marketplace,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
