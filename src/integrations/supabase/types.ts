export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      interests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["interest_status_t"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: Database["public"]["Enums"]["interest_status_t"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["interest_status_t"]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      phone_otps: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          phone: string
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          phone: string
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about: string | null
          annual_income: string | null
          birth_place: string | null
          birth_time: string | null
          caste: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          education: string | null
          email: string | null
          employed_in: string | null
          family_status: string | null
          family_type: string | null
          father_name: string | null
          full_name: string
          full_name_telugu: string | null
          gender: Database["public"]["Enums"]["gender_t"]
          gotra: string | null
          height_cm: number | null
          id: string
          last_seen: string | null
          manglik: boolean | null
          marital_status: Database["public"]["Enums"]["marital_status_t"] | null
          mother_name: string | null
          mother_tongue: string | null
          nakshatra: string | null
          nakshatra_pada: number | null
          partner_preferences: Json | null
          phone: string | null
          photo_url: string | null
          plan: Database["public"]["Enums"]["plan_t"] | null
          profession: string | null
          profile_complete: boolean | null
          rasi: string | null
          religion: string | null
          siblings: string | null
          state: string | null
          sub_caste: string | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          about?: string | null
          annual_income?: string | null
          birth_place?: string | null
          birth_time?: string | null
          caste?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: string | null
          email?: string | null
          employed_in?: string | null
          family_status?: string | null
          family_type?: string | null
          father_name?: string | null
          full_name: string
          full_name_telugu?: string | null
          gender: Database["public"]["Enums"]["gender_t"]
          gotra?: string | null
          height_cm?: number | null
          id: string
          last_seen?: string | null
          manglik?: boolean | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_t"]
            | null
          mother_name?: string | null
          mother_tongue?: string | null
          nakshatra?: string | null
          nakshatra_pada?: number | null
          partner_preferences?: Json | null
          phone?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["plan_t"] | null
          profession?: string | null
          profile_complete?: boolean | null
          rasi?: string | null
          religion?: string | null
          siblings?: string | null
          state?: string | null
          sub_caste?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          about?: string | null
          annual_income?: string | null
          birth_place?: string | null
          birth_time?: string | null
          caste?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: string | null
          email?: string | null
          employed_in?: string | null
          family_status?: string | null
          family_type?: string | null
          father_name?: string | null
          full_name?: string
          full_name_telugu?: string | null
          gender?: Database["public"]["Enums"]["gender_t"]
          gotra?: string | null
          height_cm?: number | null
          id?: string
          last_seen?: string | null
          manglik?: boolean | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_t"]
            | null
          mother_name?: string | null
          mother_tongue?: string | null
          nakshatra?: string | null
          nakshatra_pada?: number | null
          partner_preferences?: Json | null
          phone?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["plan_t"] | null
          profession?: string | null
          profile_complete?: boolean | null
          rasi?: string | null
          religion?: string | null
          siblings?: string | null
          state?: string | null
          sub_caste?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      shortlists: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          about: string | null
          annual_income: string | null
          birth_place: string | null
          caste: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          education: string | null
          employed_in: string | null
          family_status: string | null
          family_type: string | null
          full_name: string | null
          full_name_telugu: string | null
          gender: Database["public"]["Enums"]["gender_t"] | null
          gotra: string | null
          height_cm: number | null
          id: string | null
          last_seen: string | null
          manglik: boolean | null
          marital_status: Database["public"]["Enums"]["marital_status_t"] | null
          mother_tongue: string | null
          nakshatra: string | null
          nakshatra_pada: number | null
          photo_url: string | null
          plan: Database["public"]["Enums"]["plan_t"] | null
          profession: string | null
          profile_complete: boolean | null
          rasi: string | null
          religion: string | null
          siblings: string | null
          state: string | null
          sub_caste: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          about?: string | null
          annual_income?: string | null
          birth_place?: string | null
          caste?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education?: string | null
          employed_in?: string | null
          family_status?: string | null
          family_type?: string | null
          full_name?: string | null
          full_name_telugu?: string | null
          gender?: Database["public"]["Enums"]["gender_t"] | null
          gotra?: string | null
          height_cm?: number | null
          id?: string | null
          last_seen?: string | null
          manglik?: boolean | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_t"]
            | null
          mother_tongue?: string | null
          nakshatra?: string | null
          nakshatra_pada?: number | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["plan_t"] | null
          profession?: string | null
          profile_complete?: boolean | null
          rasi?: string | null
          religion?: string | null
          siblings?: string | null
          state?: string | null
          sub_caste?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          about?: string | null
          annual_income?: string | null
          birth_place?: string | null
          caste?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education?: string | null
          employed_in?: string | null
          family_status?: string | null
          family_type?: string | null
          full_name?: string | null
          full_name_telugu?: string | null
          gender?: Database["public"]["Enums"]["gender_t"] | null
          gotra?: string | null
          height_cm?: number | null
          id?: string | null
          last_seen?: string | null
          manglik?: boolean | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_t"]
            | null
          mother_tongue?: string | null
          nakshatra?: string | null
          nakshatra_pada?: number | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["plan_t"] | null
          profession?: string | null
          profile_complete?: boolean | null
          rasi?: string | null
          religion?: string | null
          siblings?: string | null
          state?: string | null
          sub_caste?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_my_profile: {
        Args: never
        Returns: {
          about: string | null
          annual_income: string | null
          birth_place: string | null
          birth_time: string | null
          caste: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          education: string | null
          email: string | null
          employed_in: string | null
          family_status: string | null
          family_type: string | null
          father_name: string | null
          full_name: string
          full_name_telugu: string | null
          gender: Database["public"]["Enums"]["gender_t"]
          gotra: string | null
          height_cm: number | null
          id: string
          last_seen: string | null
          manglik: boolean | null
          marital_status: Database["public"]["Enums"]["marital_status_t"] | null
          mother_name: string | null
          mother_tongue: string | null
          nakshatra: string | null
          nakshatra_pada: number | null
          partner_preferences: Json | null
          phone: string | null
          photo_url: string | null
          plan: Database["public"]["Enums"]["plan_t"] | null
          profession: string | null
          profile_complete: boolean | null
          rasi: string | null
          religion: string | null
          siblings: string | null
          state: string | null
          sub_caste: string | null
          updated_at: string
          verified: boolean | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_accepted_interest: {
        Args: { _a: string; _b: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      gender_t: "male" | "female"
      interest_status_t: "pending" | "accepted" | "declined"
      marital_status_t:
        | "never_married"
        | "divorced"
        | "widowed"
        | "awaiting_divorce"
      plan_t: "free" | "premium" | "elite"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      gender_t: ["male", "female"],
      interest_status_t: ["pending", "accepted", "declined"],
      marital_status_t: [
        "never_married",
        "divorced",
        "widowed",
        "awaiting_divorce",
      ],
      plan_t: ["free", "premium", "elite"],
    },
  },
} as const
