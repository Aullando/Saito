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
      athlete_groups: {
        Row: {
          athlete_id: string
          group_id: string
          organization_id: string
        }
        Insert: {
          athlete_id: string
          group_id: string
          organization_id: string
        }
        Update: {
          athlete_id?: string
          group_id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_groups_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      athletes: {
        Row: {
          birth_date: string | null
          category_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          medical_status: string
          organization_id: string
          performance_status: string
          phone: string | null
          photo_url: string | null
          section_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          category_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          medical_status?: string
          organization_id: string
          performance_status?: string
          phone?: string | null
          photo_url?: string | null
          section_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          category_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          medical_status?: string
          organization_id?: string
          performance_status?: string
          phone?: string | null
          photo_url?: string | null
          section_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "athletes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athletes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athletes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sport_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          athlete_id: string | null
          category_id: string | null
          created_at: string
          end_time: string | null
          event_date: string
          facility_id: string | null
          group_id: string | null
          id: string
          notes: string | null
          organization_id: string
          recurrence: Json | null
          section_id: string | null
          staff_id: string | null
          start_time: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          athlete_id?: string | null
          category_id?: string | null
          created_at?: string
          end_time?: string | null
          event_date: string
          facility_id?: string | null
          group_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          recurrence?: Json | null
          section_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          athlete_id?: string | null
          category_id?: string | null
          created_at?: string
          end_time?: string | null
          event_date?: string
          facility_id?: string | null
          group_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          recurrence?: Json | null
          section_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sport_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          section_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          section_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          section_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sport_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          joined_at: string
          organization_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          joined_at?: string
          organization_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          joined_at?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          organization_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          address: string | null
          capacity: number | null
          created_at: string
          id: string
          location: string | null
          name: string
          organization_id: string
          photo_url: string | null
          sports: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          organization_id: string
          photo_url?: string | null
          sports?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          capacity?: number | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          organization_id?: string
          photo_url?: string | null
          sports?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          amount: number
          applies_to_group_ids: string[] | null
          created_at: string
          frequency: string
          id: string
          kind: string
          name: string
          organization_id: string
          payment_date: string | null
          period_end: string | null
          period_start: string | null
          section_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          applies_to_group_ids?: string[] | null
          created_at?: string
          frequency?: string
          id?: string
          kind?: string
          name: string
          organization_id: string
          payment_date?: string | null
          period_end?: string | null
          period_start?: string | null
          section_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          applies_to_group_ids?: string[] | null
          created_at?: string
          frequency?: string
          id?: string
          kind?: string
          name?: string
          organization_id?: string
          payment_date?: string | null
          period_end?: string | null
          period_start?: string | null
          section_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fees_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sport_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          organization_id: string
          section_id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
          section_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          section_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sport_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_appointments: {
        Row: {
          appointment_date: string
          appointment_time: string | null
          athlete_id: string
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          reason: string | null
          staff_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time?: string | null
          athlete_id: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          reason?: string | null
          staff_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string | null
          athlete_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          reason?: string | null
          staff_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_appointments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          author_id: string
          content: string
          conversation_id: string
          created_at: string
          id: string
          organization_id: string
        }
        Insert: {
          author_id: string
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          organization_id: string
        }
        Update: {
          author_id?: string
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          language: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          athlete_id: string | null
          category_id: string | null
          created_at: string
          fee_id: string | null
          id: string
          organization_id: string
          payment_date: string | null
          section_id: string | null
          status: string
          subscription: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          athlete_id?: string | null
          category_id?: string | null
          created_at?: string
          fee_id?: string | null
          id?: string
          organization_id: string
          payment_date?: string | null
          section_id?: string | null
          status?: string
          subscription?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          athlete_id?: string | null
          category_id?: string | null
          created_at?: string
          fee_id?: string | null
          id?: string
          organization_id?: string
          payment_date?: string | null
          section_id?: string | null
          status?: string
          subscription?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_fee_id_fkey"
            columns: ["fee_id"]
            isOneToOne: false
            referencedRelation: "fees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sport_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          language: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          language?: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sport_sections: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sport_sections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization: {
        Args: { _name: string; _slug: string }
        Returns: string
      }
      current_org_id: { Args: never; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conv_participant: {
        Args: { _conv_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_member: { Args: { _org_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "sysadmin" | "admin" | "manager" | "technical" | "medical"
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
      app_role: ["sysadmin", "admin", "manager", "technical", "medical"],
    },
  },
} as const
