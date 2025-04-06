export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          code: string;
          status: 'waiting' | 'playing' | 'finished';
          phase: 'discussion' | 'voting' | null;
          created_at: string;
          max_players: number;
          current_players: number;
          host_id: string;
        };
        Insert: {
          id?: string;
          code: string;
          status: 'waiting' | 'playing' | 'finished';
          phase?: 'discussion' | 'voting' | null;
          created_at?: string;
          max_players?: number;
          current_players?: number;
          host_id: string;
        };
        Update: {
          id?: string;
          code?: string;
          status?: 'waiting' | 'playing' | 'finished';
          phase?: 'discussion' | 'voting' | null;
          created_at?: string;
          max_players?: number;
          current_players?: number;
          host_id?: string;
        };
      };
      players: {
        Row: {
          id: string;
          room_id: string;
          nickname: string;
          role: 'engineer' | 'bug' | null;
          word: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          nickname: string;
          role?: 'engineer' | 'bug' | null;
          word?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          nickname?: string;
          role?: 'engineer' | 'bug' | null;
          word?: string | null;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          room_id: string;
          voter_id: string;
          target_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          voter_id: string;
          target_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          voter_id?: string;
          target_id?: string;
          created_at?: string;
        };
      };
      engineering_words: {
        Row: {
          id: number;
          word: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          word: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          word?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          description?: string | null;
          created_at?: string;
        };
      };
    };
  };
} 