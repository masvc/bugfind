'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async () => {
    if (!nickname) {
      setError('ニックネームを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      // 部屋コードを生成（6文字）
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // 部屋を作成
      const sessionId = crypto.randomUUID();
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert([{
          code,
          status: 'waiting',
          max_players: 8,
          current_players: 1,
          host_id: sessionId,  // セッションIDをホストIDとして使用
        }])
        .select()
        .single();

      if (roomError) throw roomError;

      // プレイヤーを作成
      const { error: playerError } = await supabase
        .from('players')
        .insert([{
          id: sessionId,  // 同じセッションIDをプレイヤーIDとして使用
          room_id: room.id,
          nickname,
        }]);

      if (playerError) throw playerError;

      // セッションIDを保存
      localStorage.setItem('sessionId', sessionId);

      router.push(`/room/${room.id}`);
    } catch (err) {
      console.error(err);
      setError('部屋の作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!nickname || !roomCode) {
      setError('ニックネームと部屋コードを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      // 部屋を検索
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select()
        .eq('code', roomCode.toUpperCase())
        .single();

      if (roomError) throw roomError;

      if (room.current_players >= room.max_players) {
        setError('部屋が満員です');
        return;
      }

      // プレイヤーを作成
      const sessionId = crypto.randomUUID();
      const { error: playerError } = await supabase
        .from('players')
        .insert([{
          id: sessionId,  // セッションIDをプレイヤーIDとして使用
          room_id: room.id,
          nickname,
        }]);

      if (playerError) throw playerError;

      // セッションIDを保存
      localStorage.setItem('sessionId', sessionId);

      // 現在のプレイヤー数を更新
      await supabase
        .from('rooms')
        .update({ current_players: room.current_players + 1 })
        .eq('id', room.id);

      router.push(`/room/${room.id}`);
    } catch (err) {
      console.error(err);
      setError('部屋への参加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">BugFind</h1>
          <p className="mt-2 text-gray-600">エンジニア版ワードウルフ</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <input
              type="text"
              placeholder="ニックネーム"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={createRoom}
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              部屋を作成
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">または</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="部屋コード"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2 border rounded-md"
                disabled={isLoading}
              />
              <button
                onClick={joinRoom}
                disabled={isLoading}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                参加
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm">{error}</p>
          )}
        </div>
      </div>
    </main>
  );
}
