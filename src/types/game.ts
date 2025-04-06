export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type GamePhase = 'discussion' | 'voting' | null;
export type PlayerRole = 'engineer' | 'bug';
export type WordDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  phase: GamePhase;
  created_at: string;
  max_players: number;
  current_players: number;
  host_id: string;
  words: string[];
  difficulty: WordDifficulty | null;
}

export interface Player {
  id: string;
  session_id: string;
  room_id: string;
  nickname: string;
  role: PlayerRole | null;
  word: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  room_id: string;
  voter_id: string;
  target_id: string;
  created_at: string;
}

export interface EngineeringWord {
  id: number;
  word: string;
  difficulty: WordDifficulty;
  description: string;
  created_at: string;
} 