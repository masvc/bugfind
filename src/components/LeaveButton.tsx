import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Room, Player } from '@/types/game';

interface LeaveButtonProps {
  room: Room;
  currentPlayer: Player | null;
}

export function LeaveButton({ room, currentPlayer }: LeaveButtonProps) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState('');

  const handleLeave = async () => {
    if (!currentPlayer || isLeaving) return;
    
    if (!confirm('本当に退出しますか？')) return;

    setIsLeaving(true);
    try {
      // プレイヤーを削除
      await supabase
        .from('players')
        .delete()
        .eq('id', currentPlayer.id);

      // 部屋のプレイヤー数を更新
      const newPlayerCount = room.current_players - 1;
      await supabase
        .from('rooms')
        .update({
          current_players: newPlayerCount,
          // プレイヤーが2人未満になった場合はゲームを中断
          ...(room.status === 'playing' && newPlayerCount < 2
            ? { status: 'waiting', phase: null }
            : {}),
        })
        .eq('id', room.id);

      // セッションIDを削除
      localStorage.removeItem('sessionId');
      
      // ホームページに戻る
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('退出に失敗しました');
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleLeave}
        disabled={isLeaving}
        className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
      >
        {isLeaving ? '退出中...' : '部屋を退出'}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
} 