import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Room, Player, Vote } from '@/types/game';

interface VotingPhaseProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  votes: Vote[];
}

export function VotingPhase({ room, players, votes, currentPlayer }: VotingPhaseProps) {
  const [error, setError] = useState('');
  const [isRestarting, setIsRestarting] = useState(false);

  // 現在のプレイヤーが投票済みかチェック
  const hasVoted = votes.some((vote) => vote.voter_id === currentPlayer?.id);

  const handleVote = async (targetId: string) => {
    if (!currentPlayer || hasVoted) return;

    try {
      const { error } = await supabase.from('votes').insert({
        room_id: room.id,
        voter_id: currentPlayer.id,
        target_id: targetId,
      });

      if (error) throw error;
    } catch (err) {
      console.error(err);
      setError('投票に失敗しました');
    }
  };

  const handleRestart = async () => {
    if (!currentPlayer || !room) return;
    setIsRestarting(true);

    try {
      // 投票をクリア
      await supabase.from('votes').delete().eq('room_id', room.id);

      // プレイヤーの役職とワードをリセット
      await supabase
        .from('players')
        .update({ role: null, word: null })
        .eq('room_id', room.id);

      // 部屋のステータスを待機中に戻す
      await supabase
        .from('rooms')
        .update({ status: 'waiting', phase: null })
        .eq('id', room.id);
    } catch (err) {
      console.error(err);
      setError('リスタートに失敗しました');
    } finally {
      setIsRestarting(false);
    }
  };

  // 全員が投票したかチェック
  const allVoted = votes.length === players.length;
  const voteCounts = players.reduce((acc, player) => {
    acc[player.id] = votes.filter((vote) => vote.target_id === player.id).length;
    return acc;
  }, {} as Record<string, number>);

  // 最多投票数を取得
  const maxVotes = Math.max(...Object.values(voteCounts));
  // 最多投票のプレイヤーを取得
  const mostVotedPlayers = players.filter((player) => voteCounts[player.id] === maxVotes);
  // バグのプレイヤーを取得
  const bugPlayer = players.find((player) => player.role === 'bug');
  // エンジニアの勝利かどうか
  const engineersWin = bugPlayer && mostVotedPlayers.some((player) => player.id === bugPlayer.id);

  // 投票結果を表示
  if (allVoted) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">投票結果</h2>
        <div className="grid gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className={`p-4 border rounded-md text-center ${
                mostVotedPlayers.includes(player) ? 'border-red-500 border-2' : ''
              } ${player.role === 'bug' ? 'bg-red-50' : ''}`}
            >
              <div className="font-medium">{player.nickname}</div>
              <div className="text-sm text-gray-600">
                投票数: {voteCounts[player.id]}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center space-y-4">
          <div className="text-lg font-bold">
            {engineersWin ? 'エンジニアの勝利！バグを退治しました！' : 'バグの勝利！バグは逃げ切りました...'}
          </div>
          <button
            onClick={handleRestart}
            disabled={isRestarting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isRestarting ? 'リスタート中...' : '同じメンバーでリスタート'}
          </button>
        </div>
      </div>
    );
  }

  // 投票画面を表示
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">投票</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <div className="grid gap-4">
        {players.map((player) =>
          player.id !== currentPlayer?.id ? (
            <button
              key={player.id}
              onClick={() => handleVote(player.id)}
              disabled={hasVoted}
              className="p-4 border rounded-md text-left hover:border-blue-500 disabled:opacity-50"
            >
              <div className="font-medium">{player.nickname}</div>
            </button>
          ) : null
        )}
      </div>
      {hasVoted && (
        <p className="text-center text-gray-600">
          投票完了！他のプレイヤーの投票を待っています...
        </p>
      )}
    </div>
  );
} 