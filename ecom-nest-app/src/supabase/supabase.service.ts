import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Generic Supabase service for client initialization and configuration.
 * This service provides the base Supabase client instance that can be used
 * across the application. For specialized operations (auth, storage, etc.),
 * use dedicated services in their respective modules.
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.supabaseUrl = this.configService.getOrThrow<string>("SUPABASE_URL");
    this.supabaseKey = this.configService.getOrThrow<string>(
      "SUPABASE_SERVICE_ROLE_KEY",
    );

    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Get the base Supabase client instance.
   * Use this for general database operations, storage, realtime, etc.
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Create a user-scoped Supabase client with an access token.
   * Useful for operations that require user context (e.g., user-specific queries).
   */
  getUserClient(accessToken: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }

  /**
   * Get Supabase configuration values.
   * Useful for services that need to create their own clients.
   */
  getConfig(): { url: string; serviceRoleKey: string } {
    return {
      url: this.supabaseUrl,
      serviceRoleKey: this.supabaseKey,
    };
  }
}
