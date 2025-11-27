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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      aftercare_tips: {
        Row: {
          artist_id: string
          created_at: string | null
          id: string
          instructions: string
          title: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          id?: string
          instructions: string
          title: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          id?: string
          instructions?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aftercare_tips_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      apps: {
        Row: {
          artist_id: string
          calendar_sync: boolean | null
          created_at: string | null
          id: string
          push_notifications: boolean | null
          swipe_navigation: boolean | null
          updated_at: string | null
          watermark_enabled: boolean | null
          watermark_image: string | null
          watermark_opacity: number | null
          watermark_position: string | null
          watermark_text: string | null
          welcome_screen_enabled: boolean | null
        }
        Insert: {
          artist_id: string
          calendar_sync?: boolean | null
          created_at?: string | null
          id?: string
          push_notifications?: boolean | null
          swipe_navigation?: boolean | null
          updated_at?: string | null
          watermark_enabled?: boolean | null
          watermark_image?: string | null
          watermark_opacity?: number | null
          watermark_position?: string | null
          watermark_text?: string | null
          welcome_screen_enabled?: boolean | null
        }
        Update: {
          artist_id?: string
          calendar_sync?: boolean | null
          created_at?: string | null
          id?: string
          push_notifications?: boolean | null
          swipe_navigation?: boolean | null
          updated_at?: string | null
          watermark_enabled?: boolean | null
          watermark_image?: string | null
          watermark_opacity?: number | null
          watermark_position?: string | null
          watermark_text?: string | null
          welcome_screen_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "apps_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_flashs: {
        Row: {
          artist_id: string
          created_at: string | null
          flash_image: string | null
          flash_name: string | null
          flash_price: number
          id: string
          repeatable: boolean
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          flash_image?: string | null
          flash_name?: string | null
          flash_price?: number
          id?: string
          repeatable?: boolean
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          flash_image?: string | null
          flash_name?: string | null
          flash_price?: number
          id?: string
          repeatable?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_flashs_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_portfolios: {
        Row: {
          artist_id: string
          created_at: string | null
          id: string
          portfolio_description: string | null
          portfolio_image: string | null
          portfolio_name: string | null
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          id?: string
          portfolio_description?: string | null
          portfolio_image?: string | null
          portfolio_name?: string | null
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          id?: string
          portfolio_description?: string | null
          portfolio_image?: string | null
          portfolio_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_portfolios_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          avatar: string | null
          booking_link: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          photo: string | null
          social_handler: string | null
          studio_name: string | null
          subscription_active: boolean | null
          subscription_type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          booking_link: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          photo?: string | null
          social_handler?: string | null
          studio_name?: string | null
          subscription_active?: boolean | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          booking_link?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          photo?: string | null
          social_handler?: string | null
          studio_name?: string | null
          subscription_active?: boolean | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          location: string
          phone_number: string
          project_notes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          location: string
          phone_number: string
          project_notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          location?: string
          phone_number?: string
          project_notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      drawings: {
        Row: {
          artist_notes: string | null
          client_notes: string | null
          created_at: string | null
          id: string
          image_url: string
          is_approved: boolean
          project_id: string
          updated_at: string | null
        }
        Insert: {
          artist_notes?: string | null
          client_notes?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_approved?: boolean
          project_id: string
          updated_at?: string | null
        }
        Update: {
          artist_notes?: string | null
          client_notes?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_approved?: boolean
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drawings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      event_block_times: {
        Row: {
          artist_id: string
          created_at: string | null
          date: string
          end_time: string
          id: string
          notes: string | null
          repeat_duration: number
          repeat_duration_unit: string
          repeat_type: string
          repeatable: boolean
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          notes?: string | null
          repeat_duration?: number
          repeat_duration_unit?: string
          repeat_type?: string
          repeatable?: boolean
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          repeat_duration?: number
          repeat_duration_unit?: string
          repeat_type?: string
          repeatable?: boolean
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_block_times_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          allday: boolean
          artist_id: string
          color: string
          created_at: string | null
          end_date: string
          id: string
          source: string
          source_id: string
          start_date: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          allday?: boolean
          artist_id: string
          color?: string
          created_at?: string | null
          end_date: string
          id?: string
          source?: string
          source_id: string
          start_date: string
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          allday?: boolean
          artist_id?: string
          color?: string
          created_at?: string | null
          end_date?: string
          id?: string
          source?: string
          source_id?: string
          start_date?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_categories: {
        Row: {
          artist_id: string
          category_name: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          category_name: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          category_name?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_categories_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          answer: string
          category_id: string
          created_at: string | null
          id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category_id: string
          created_at?: string | null
          id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category_id?: string
          created_at?: string | null
          id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      flows: {
        Row: {
          artist_id: string
          auto_email: boolean
          auto_fill_drawing_enabled: boolean
          back_to_back_enabled: boolean
          break_time: number | null
          buffer_between_sessions: number | null
          change_policy_time: number | null
          consult_duration: number | null
          consult_enabled: boolean
          consult_in_person: boolean
          consult_meeting_url: string | null
          consult_online: boolean
          consult_start_times: Json
          consult_work_days: string[]
          created_at: string | null
          diff_consult_time_enabled: boolean
          diff_time_enabled: boolean
          end_times: Json
          final_appointment_remind_time: number | null
          id: string
          max_back_to_back: number | null
          max_reschedules: number | null
          multiple_sessions_enabled: boolean
          receive_drawing_time: number | null
          reschedule_booking_days: number | null
          send_drawings_in_advance: boolean
          session_duration: number | null
          sessions_per_day: number | null
          start_times: Json
          updated_at: string | null
          work_days: string[]
        }
        Insert: {
          artist_id: string
          auto_email?: boolean
          auto_fill_drawing_enabled?: boolean
          back_to_back_enabled?: boolean
          break_time?: number | null
          buffer_between_sessions?: number | null
          change_policy_time?: number | null
          consult_duration?: number | null
          consult_enabled?: boolean
          consult_in_person?: boolean
          consult_meeting_url?: string | null
          consult_online?: boolean
          consult_start_times?: Json
          consult_work_days?: string[]
          created_at?: string | null
          diff_consult_time_enabled?: boolean
          diff_time_enabled?: boolean
          end_times?: Json
          final_appointment_remind_time?: number | null
          id?: string
          max_back_to_back?: number | null
          max_reschedules?: number | null
          multiple_sessions_enabled?: boolean
          receive_drawing_time?: number | null
          reschedule_booking_days?: number | null
          send_drawings_in_advance?: boolean
          session_duration?: number | null
          sessions_per_day?: number | null
          start_times?: Json
          updated_at?: string | null
          work_days?: string[]
        }
        Update: {
          artist_id?: string
          auto_email?: boolean
          auto_fill_drawing_enabled?: boolean
          back_to_back_enabled?: boolean
          break_time?: number | null
          buffer_between_sessions?: number | null
          change_policy_time?: number | null
          consult_duration?: number | null
          consult_enabled?: boolean
          consult_in_person?: boolean
          consult_meeting_url?: string | null
          consult_online?: boolean
          consult_start_times?: Json
          consult_work_days?: string[]
          created_at?: string | null
          diff_consult_time_enabled?: boolean
          diff_time_enabled?: boolean
          end_times?: Json
          final_appointment_remind_time?: number | null
          id?: string
          max_back_to_back?: number | null
          max_reschedules?: number | null
          multiple_sessions_enabled?: boolean
          receive_drawing_time?: number | null
          reschedule_booking_days?: number | null
          send_drawings_in_advance?: boolean
          session_duration?: number | null
          sessions_per_day?: number | null
          start_times?: Json
          updated_at?: string | null
          work_days?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "flows_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          artist_id: string
          client_id: string
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          client_id: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "links_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          artist_id: string
          coordinates: Json
          created_at: string | null
          id: string
          is_main_studio: boolean | null
          place_id: string
          source: string | null
          source_end: string | null
          source_id: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          artist_id: string
          coordinates: Json
          created_at?: string | null
          id?: string
          is_main_studio?: boolean | null
          place_id: string
          source?: string | null
          source_end?: string | null
          source_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          artist_id?: string
          coordinates?: Json
          created_at?: string | null
          id?: string
          is_main_studio?: boolean | null
          place_id?: string
          source?: string | null
          source_end?: string | null
          source_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      mark_unavailables: {
        Row: {
          artist_id: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          repeat_duration: number
          repeat_duration_unit: string
          repeat_type: string
          repeatable: boolean
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          repeat_duration?: number
          repeat_duration_unit?: string
          repeat_type?: string
          repeatable?: boolean
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          repeat_duration?: number
          repeat_duration_unit?: string
          repeat_type?: string
          repeatable?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mark_unavailables_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      off_days: {
        Row: {
          artist_id: string
          created_at: string | null
          end_date: string
          id: string
          is_repeat: boolean
          notes: string | null
          repeat_duration: number
          repeat_duration_unit: string
          repeat_type: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          end_date: string
          id?: string
          is_repeat?: boolean
          notes?: string | null
          repeat_duration?: number
          repeat_duration_unit?: string
          repeat_type?: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_repeat?: boolean
          notes?: string | null
          repeat_duration?: number
          repeat_duration_unit?: string
          repeat_type?: string
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "off_days_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          artist_id: string
          client_id: string
          created_at: string | null
          deposit_amount: number
          deposit_paid: boolean
          deposit_paid_date: string | null
          deposit_payment_method: string | null
          id: string
          notes: string | null
          status: string
          title: string
          updated_at: string | null
          waiver_signed: boolean
          waiver_url: string | null
        }
        Insert: {
          artist_id: string
          client_id: string
          created_at?: string | null
          deposit_amount: number
          deposit_paid?: boolean
          deposit_paid_date?: string | null
          deposit_payment_method?: string | null
          id?: string
          notes?: string | null
          status?: string
          title: string
          updated_at?: string | null
          waiver_signed?: boolean
          waiver_url?: string | null
        }
        Update: {
          artist_id?: string
          client_id?: string
          created_at?: string | null
          deposit_amount?: number
          deposit_paid?: boolean
          deposit_paid_date?: string | null
          deposit_payment_method?: string | null
          id?: string
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          waiver_signed?: boolean
          waiver_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_appointments: {
        Row: {
          artist_id: string
          created_at: string | null
          date: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone_number: string | null
          session_length: number
          start_time: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          date: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone_number?: string | null
          session_length: number
          start_time: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          date?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone_number?: string | null
          session_length?: number
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_appointments_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      rules: {
        Row: {
          artist_id: string
          cancellation_policy: string | null
          created_at: string | null
          creditcard_enabled: boolean
          creditcard_method: string | null
          deposit_amount: number | null
          deposit_hold_time: number | null
          deposit_policy: string | null
          deposit_remind_time: number | null
          etransfer_enabled: boolean
          etransfer_method: string | null
          id: string
          paypal_enabled: boolean
          paypal_method: string | null
          privacy_policy: string | null
          question_one: string | null
          question_two: string | null
          reschedule_policy: string | null
          terms_of_condition: string | null
          updated_at: string | null
          venmo_enabled: boolean
          venmo_method: string | null
          waiver_text: string | null
        }
        Insert: {
          artist_id: string
          cancellation_policy?: string | null
          created_at?: string | null
          creditcard_enabled?: boolean
          creditcard_method?: string | null
          deposit_amount?: number | null
          deposit_hold_time?: number | null
          deposit_policy?: string | null
          deposit_remind_time?: number | null
          etransfer_enabled?: boolean
          etransfer_method?: string | null
          id?: string
          paypal_enabled?: boolean
          paypal_method?: string | null
          privacy_policy?: string | null
          question_one?: string | null
          question_two?: string | null
          reschedule_policy?: string | null
          terms_of_condition?: string | null
          updated_at?: string | null
          venmo_enabled?: boolean
          venmo_method?: string | null
          waiver_text?: string | null
        }
        Update: {
          artist_id?: string
          cancellation_policy?: string | null
          created_at?: string | null
          creditcard_enabled?: boolean
          creditcard_method?: string | null
          deposit_amount?: number | null
          deposit_hold_time?: number | null
          deposit_policy?: string | null
          deposit_remind_time?: number | null
          etransfer_enabled?: boolean
          etransfer_method?: string | null
          id?: string
          paypal_enabled?: boolean
          paypal_method?: string | null
          privacy_policy?: string | null
          question_one?: string | null
          question_two?: string | null
          reschedule_policy?: string | null
          terms_of_condition?: string | null
          updated_at?: string | null
          venmo_enabled?: boolean
          venmo_method?: string | null
          waiver_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rules_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          date: string
          duration: number
          id: string
          location_id: string
          notes: string | null
          payment_method: string | null
          project_id: string
          reschedule_count: number
          session_rate: number
          source: string
          source_id: string | null
          start_time: string
          tip: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          duration: number
          id?: string
          location_id: string
          notes?: string | null
          payment_method?: string | null
          project_id: string
          reschedule_count?: number
          session_rate: number
          source?: string
          source_id?: string | null
          start_time: string
          tip?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          duration?: number
          id?: string
          location_id?: string
          notes?: string | null
          payment_method?: string | null
          project_id?: string
          reschedule_count?: number
          session_rate?: number
          source?: string
          source_id?: string | null
          start_time?: string
          tip?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      spot_conventions: {
        Row: {
          artist_id: string
          created_at: string | null
          dates: string[]
          diff_time_enabled: boolean
          end_times: Json
          id: string
          location_id: string
          notes: string | null
          start_times: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          dates: string[]
          diff_time_enabled?: boolean
          end_times?: Json
          id?: string
          location_id: string
          notes?: string | null
          start_times?: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          dates?: string[]
          diff_time_enabled?: boolean
          end_times?: Json
          id?: string
          location_id?: string
          notes?: string | null
          start_times?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spot_conventions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spot_conventions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          artist_id: string
          created_at: string | null
          data_android: string | null
          expiry_date: string
          id: string
          is_active: boolean | null
          product_id: string
          receipt_data: string
          signature_android: string | null
          subscribe_date: string
          subscribe_token: string | null
          subscription_type: string
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          data_android?: string | null
          expiry_date: string
          id?: string
          is_active?: boolean | null
          product_id: string
          receipt_data: string
          signature_android?: string | null
          subscribe_date: string
          subscribe_token?: string | null
          subscription_type: string
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          data_android?: string | null
          expiry_date?: string
          id?: string
          is_active?: boolean | null
          product_id?: string
          receipt_data?: string
          signature_android?: string | null
          subscribe_date?: string
          subscribe_token?: string | null
          subscription_type?: string
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_changes: {
        Row: {
          artist_id: string
          created_at: string | null
          different_time_enabled: boolean
          end_date: string
          end_times: Json
          id: string
          location_id: string
          notes: string | null
          start_date: string
          start_times: Json
          updated_at: string | null
          work_days: string[]
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          different_time_enabled?: boolean
          end_date: string
          end_times?: Json
          id?: string
          location_id: string
          notes?: string | null
          start_date: string
          start_times?: Json
          updated_at?: string | null
          work_days?: string[]
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          different_time_enabled?: boolean
          end_date?: string
          end_times?: Json
          id?: string
          location_id?: string
          notes?: string | null
          start_date?: string
          start_times?: Json
          updated_at?: string | null
          work_days?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "temp_changes_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "temp_changes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          appointment_confirmation_no_profile_body: string | null
          appointment_confirmation_no_profile_subject: string | null
          appointment_confirmation_with_profile_body: string | null
          appointment_confirmation_with_profile_subject: string | null
          appointment_final_confirmation_body: string | null
          appointment_final_confirmation_subject: string | null
          artist_id: string
          booking_request_approved_auto_body: string | null
          booking_request_approved_auto_subject: string | null
          booking_request_approved_manual_body: string | null
          booking_request_approved_manual_subject: string | null
          cancellation_notification_body: string | null
          cancellation_notification_subject: string | null
          consult_confirmation_body: string | null
          consult_confirmation_subject: string | null
          consult_declined_body: string | null
          consult_declined_subject: string | null
          consult_reminder_body: string | null
          consult_reminder_subject: string | null
          created_at: string | null
          declined_booking_request_body: string | null
          declined_booking_request_subject: string | null
          deposit_forfeit_body: string | null
          deposit_forfeit_subject: string | null
          deposit_keep_body: string | null
          deposit_keep_subject: string | null
          deposit_payment_reminder_body: string | null
          deposit_payment_reminder_subject: string | null
          healing_check_in_body: string | null
          healing_check_in_subject: string | null
          id: string
          new_booking_request_received_body: string | null
          new_booking_request_received_subject: string | null
          updated_at: string | null
          waiver_reminder_body: string | null
          waiver_reminder_subject: string | null
        }
        Insert: {
          appointment_confirmation_no_profile_body?: string | null
          appointment_confirmation_no_profile_subject?: string | null
          appointment_confirmation_with_profile_body?: string | null
          appointment_confirmation_with_profile_subject?: string | null
          appointment_final_confirmation_body?: string | null
          appointment_final_confirmation_subject?: string | null
          artist_id: string
          booking_request_approved_auto_body?: string | null
          booking_request_approved_auto_subject?: string | null
          booking_request_approved_manual_body?: string | null
          booking_request_approved_manual_subject?: string | null
          cancellation_notification_body?: string | null
          cancellation_notification_subject?: string | null
          consult_confirmation_body?: string | null
          consult_confirmation_subject?: string | null
          consult_declined_body?: string | null
          consult_declined_subject?: string | null
          consult_reminder_body?: string | null
          consult_reminder_subject?: string | null
          created_at?: string | null
          declined_booking_request_body?: string | null
          declined_booking_request_subject?: string | null
          deposit_forfeit_body?: string | null
          deposit_forfeit_subject?: string | null
          deposit_keep_body?: string | null
          deposit_keep_subject?: string | null
          deposit_payment_reminder_body?: string | null
          deposit_payment_reminder_subject?: string | null
          healing_check_in_body?: string | null
          healing_check_in_subject?: string | null
          id?: string
          new_booking_request_received_body?: string | null
          new_booking_request_received_subject?: string | null
          updated_at?: string | null
          waiver_reminder_body?: string | null
          waiver_reminder_subject?: string | null
        }
        Update: {
          appointment_confirmation_no_profile_body?: string | null
          appointment_confirmation_no_profile_subject?: string | null
          appointment_confirmation_with_profile_body?: string | null
          appointment_confirmation_with_profile_subject?: string | null
          appointment_final_confirmation_body?: string | null
          appointment_final_confirmation_subject?: string | null
          artist_id?: string
          booking_request_approved_auto_body?: string | null
          booking_request_approved_auto_subject?: string | null
          booking_request_approved_manual_body?: string | null
          booking_request_approved_manual_subject?: string | null
          cancellation_notification_body?: string | null
          cancellation_notification_subject?: string | null
          consult_confirmation_body?: string | null
          consult_confirmation_subject?: string | null
          consult_declined_body?: string | null
          consult_declined_subject?: string | null
          consult_reminder_body?: string | null
          consult_reminder_subject?: string | null
          created_at?: string | null
          declined_booking_request_body?: string | null
          declined_booking_request_subject?: string | null
          deposit_forfeit_body?: string | null
          deposit_forfeit_subject?: string | null
          deposit_keep_body?: string | null
          deposit_keep_subject?: string | null
          deposit_payment_reminder_body?: string | null
          deposit_payment_reminder_subject?: string | null
          healing_check_in_body?: string | null
          healing_check_in_subject?: string | null
          id?: string
          new_booking_request_received_body?: string | null
          new_booking_request_received_subject?: string | null
          updated_at?: string | null
          waiver_reminder_body?: string | null
          waiver_reminder_subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_artist_by_booking_link: {
        Args: { booking_link_param: string }
        Returns: {
          app: Json
          artist_id: string
          avatar: string
          booking_link: string
          email: string
          flow: Json
          full_name: string
          locations: Json
          photo: string
          rule: Json
          social_handler: string
          studio_name: string
          subscription: Json
          subscription_active: boolean
          subscription_type: string
          template: Json
        }[]
      }
      get_artist_full_data: {
        Args: { artist_uuid: string }
        Returns: {
          app: Json
          artist_id: string
          avatar: string
          booking_link: string
          email: string
          flow: Json
          full_name: string
          locations: Json
          photo: string
          rule: Json
          social_handler: string
          studio_name: string
          subscription: Json
          subscription_active: boolean
          subscription_type: string
          template: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
