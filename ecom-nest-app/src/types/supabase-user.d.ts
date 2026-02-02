import { User } from "@supabase/supabase-js";

export type SupabaseUser = User & { id: string };
