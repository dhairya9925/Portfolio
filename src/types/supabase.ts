export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      portfolio_personal_detail: {
        Row: {
          id: number
          full_name?: string
          tagline?: string
          bio?: string
          profile_image?: string
          resume_url?: string
          email?: string
          github?: string
          linkedin?: string
          twitter?: string
          projects_completed?: number
          years_of_experience?: number
          clients?: number
        }
        Insert: any
        Update: any
      }
      portfolio_contact: {
        Row: {
          id: number
          email: string
          phone?: string
          address?: string
        }
        Insert: any
        Update: any
      }
      portfolio_education: {
        Row: {
          id: number
          school: string
          course: string
          start_date?: string
          end_date?: string
          note?: string
          order?: number
        }
        Insert: any
        Update: any
      }
      portfolio_projects: {
        Row: {
          id: number
          title: string
          description: string
          project_type?: string
          live_link?: string
          github_link?: string
          cover_photo?: string
          order?: number
        }
        Insert: any
        Update: any
      }
      portfolio_technologies: {
        Row: {
          id: number
          technology: string
          category?: string
          proficiency?: number
          icon?: string
          order?: number
        }
        Insert: any
        Update: any
      }
      portfolio_project_technologies: {
        Row: {
          id: number
          project_id: number
          technology_id: number
        }
        Insert: any
        Update: any
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
