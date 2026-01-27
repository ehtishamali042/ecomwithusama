import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { User } from "@supabase/supabase-js";

/**
 * Service for handling Supabase authentication operations.
 * This service encapsulates all auth-related Supabase client interactions,
 * keeping the generic SupabaseService focused on client management.
 */
@Injectable()
export class SupabaseAuthService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Validate an access token and return the user
   */
  async getUser(accessToken: string): Promise<User | null> {
    const supabase = this.supabaseService.getClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return null;
    }

    return user;
  }

  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string) {
    const supabase = this.supabaseService.getClient();
    return supabase.auth.signUp({
      email,
      password,
    });
  }

  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string) {
    const supabase = this.supabaseService.getClient();
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  /**
   * Refresh session using refresh token
   */
  async refreshSession(refreshToken: string) {
    const supabase = this.supabaseService.getClient();
    return supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
  }

  /**
   * Sign out a user (invalidate session)
   */
  async signOut(accessToken: string) {
    // Use getUserClient to create a user-scoped client for sign out
    const userClient = this.supabaseService.getUserClient(accessToken);
    return userClient.auth.signOut();
  }
}
