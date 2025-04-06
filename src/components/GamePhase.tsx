import { useEffect, useState } from 'react';
import { GameTimer } from './GameTimer';
import { VotingPhase } from './VotingPhase';
import { supabase } from '@/lib/supabase';
import type { Room, Player, Vote } from '@/types/game';

interface GamePhaseProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
}

export function GamePhase({ room, players, currentPlayer }: GamePhaseProps) {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    if (room.phase !== 'voting') return;

    // 投票データを取得
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select()
        .eq('room_id', room.id);

      if (error) {
        console.error('投票データの取得に失敗しました:', error);
        return;
      }

      setVotes(data);
    };

    fetchVotes();

    // 投票のリアルタイム更新を購読
    const votesSubscription = supabase
      .channel('votes_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${room.id}` },
        () => {
          fetchVotes();
        }
      )
      .subscribe();

    return () => {
      votesSubscription.unsubscribe();
    };
  }, [room.id, room.phase]);

  const handleTimeUp = async () => {
    if (room.phase === 'discussion') {
      // 討論フェーズ終了時、投票フェーズへ移行
      await supabase
        .from('rooms')
        .update({ phase: 'voting' })
        .eq('id', room.id);
    }
  };

  if (room.status !== 'playing') {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {room.phase === 'discussion' ? '討論フェーズ' : '投票フェーズ'}
          </h2>
          {currentPlayer && (
            <div className="text-lg">
              あなたのワード: <span className="font-bold">{currentPlayer.word}</span>
            </div>
          )}
        </div>

        {room.phase === 'discussion' && (
          <>
            <GameTimer duration={120} onTimeUp={handleTimeUp} />
            <div className="text-center text-gray-600">
              <p>他のプレイヤーと話し合って、バグを見つけましょう！</p>
              <p className="text-sm mt-1">※1分経過でSTOPが表示され、2分で投票フェーズに移行します</p>
            </div>
          </>
        )}

        {room.phase === 'voting' && (
          <VotingPhase
            room={room}
            players={players}
            currentPlayer={currentPlayer}
            votes={votes}
          />
        )}
      </div>
    </div>
  );
} 