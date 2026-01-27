import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { SupabaseAuthService } from "./supabase-auth.service";
import { SupabaseService } from "../supabase/supabase.service";
import { RegisterDto, LoginDto, RefreshTokenDto } from "./dto";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}

@Injectable()
export class AuthService {
  constructor(
    private supabaseAuthService: SupabaseAuthService,
    private supabaseService: SupabaseService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data, error } = await this.supabaseAuthService.signUp(
      dto.email,
      dto.password,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    // If user is created but no session, likely needs email confirmation
    if (data.user && !data.session) {
      return {
        message: 'Registration successful, please check your email to confirm your account.',
        user: {
          id: data.user.id,
          email: data.user.email,
        }
      } as any;
    }
    if (!data.user) {
      throw new BadRequestException("Registration failed");
    }

    return this.formatAuthResponse(data.user, data.session);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data, error } = await this.supabaseAuthService.signInWithPassword(
      dto.email,
      dto.password,
    );

    if (error) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!data.user || !data.session) {
      throw new UnauthorizedException("Login failed");
    }

    return this.formatAuthResponse(data.user, data.session);
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthResponse> {
    const { data, error } = await this.supabaseAuthService.refreshSession(
      dto.refreshToken,
    );

    if (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (!data.user || !data.session) {
      throw new UnauthorizedException("Token refresh failed");
    }

    return this.formatAuthResponse(data.user, data.session);
  }

  async logout(accessToken: string): Promise<{ message: string }> {
    const { error } = await this.supabaseAuthService.signOut(accessToken);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: "Logged out successfully" };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const supabase = this.supabaseService.getClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      throw new UnauthorizedException("User not found");
    }

    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
    };
  }

  private formatAuthResponse(user: any, session: any): AuthResponse {
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
      },
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at,
      },
    };
  }
}
