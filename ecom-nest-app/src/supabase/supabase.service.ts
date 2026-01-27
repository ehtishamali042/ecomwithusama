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
  private supabaseSecretKey: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.supabaseUrl = this.configService.getOrThrow<string>("SUPABASE_URL");
    // Supabase renamed "service_role" key to "secret key".
    // Prefer the new env var but keep legacy fallback for compatibility.
    const secretKey =
      this.configService.get<string>("SUPABASE_SECRET_KEY") ??
      this.configService.get<string>("SUPABASE_SERVICE_ROLE_KEY");

    if (!secretKey) {
      throw new Error(
        'Missing Supabase secret key. Set "SUPABASE_SECRET_KEY" (recommended) or legacy "SUPABASE_SERVICE_ROLE_KEY".',
      );
    }

    this.supabaseSecretKey = secretKey;

    this.supabase = createClient(this.supabaseUrl, this.supabaseSecretKey, {
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
    return createClient(this.supabaseUrl, this.supabaseSecretKey, {
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
  getConfig(): { url: string; secretKey: string; serviceRoleKey: string } {
    return {
      url: this.supabaseUrl,
      // Prefer `secretKey` going forward. `serviceRoleKey` is kept for backwards compatibility.
      secretKey: this.supabaseSecretKey,
      serviceRoleKey: this.supabaseSecretKey,
    };
  }
}
