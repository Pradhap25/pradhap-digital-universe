/**
 * Supabase Database type definitions.
 * Includes explicit types for site_stats and atomic increment RPC alongside dynamic CMS tables.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, Json>;
        Insert: Record<string, Json>;
        Update: Record<string, Json>;
        Relationships: [];
      }
    >;
    Views: Record<string, never>;
    Functions: {
      increment_site_visits: {
        Args: Record<string, never>;
        Returns: {
          total_visits: number;
          updated_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
