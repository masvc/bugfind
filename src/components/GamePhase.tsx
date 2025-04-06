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
    console.log('GamePhase mounted with room:', room);
    console.log('Current player:', currentPlayer);

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

      console.log('Fetched votes:', data);
      setVotes(data);
    };

    fetchVotes();

    // 投票のリアルタイム更新を購読
    const votesSubscription = supabase
      .channel('votes_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${room.id}` },
        (payload) => {
          console.log('Votes changed:', payload);
          fetchVotes();
        }
      )
      .subscribe((status) => {
        console.log('Votes subscription status:', status);
      });

    return () => {
      console.log('Cleaning up votes subscription...');
      votesSubscription.unsubscribe();
    };
  }, [room.id, room.phase]);

  const handleTimeUp = async () => {
    if (room.phase === 'discussion') {
      console.log('Discussion time up, moving to voting phase...');
      const { error } = await supabase
        .from('rooms')
        .update({ phase: 'voting' })
        .eq('id', room.id);

      if (error) {
        console.error('Failed to update room phase:', error);
      }
    }
  };

  if (room.status !== 'playing') {
    console.log('Room is not in playing state:', room.status);
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {room.phase === 'discussion' ? '討論フェーズ' : '投票フェーズ'}
          </h2>
          {currentPlayer && currentPlayer.word && (
            <div className="text-lg">
              あなたのワード: <span className="font-bold">{currentPlayer.word}</span>
              {currentPlayer.role === 'bug' && (
                <p className="text-sm text-red-600 mt-1">あなたはバグです！</p>
              )}
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