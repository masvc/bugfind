'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Room, Player, WordDifficulty } from '@/types/game';
import { GamePhase } from '@/components/GamePhase';
import { LeaveButton } from '@/components/LeaveButton';
import { DifficultySelector } from '@/components/DifficultySelector';

export default function RoomPage() {
  const params = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<WordDifficulty>('beginner');

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select()
          .eq('id', params.id)
          .single();

        if (roomError) throw roomError;
        setRoom(roomData);

        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select()
          .eq('room_id', params.id);

        if (playersError) throw playersError;
        setPlayers(playersData);

        // セッションIDを生成（実際のアプリではより適切な認証方法を使用）
        const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
        localStorage.setItem('sessionId', sessionId);

        // 現在のプレイヤーを特定
        const player = playersData.find(p => p.id === sessionId);
        setCurrentPlayer(player || null);
      } catch (err) {
        console.error(err);
        setError('データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();

    // リアルタイム更新の購読
    const roomSubscription = supabase
      .channel('room_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${params.id}` },
        async (payload) => {
          console.log('Room changed:', payload);
          if (payload.new) {
            const newRoom = payload.new as Room;
            setRoom(newRoom);
            
            // ゲーム開始時の処理
            if (newRoom.status === 'playing' && newRoom.phase === 'discussion') {
              console.log('Game started, fetching updated player data...');
              const { data: updatedPlayers } = await supabase
                .from('players')
                .select()
                .eq('room_id', params.id);
              
              if (updatedPlayers) {
                setPlayers(updatedPlayers);
                const sessionId = localStorage.getItem('sessionId');
                const updatedCurrentPlayer = updatedPlayers.find(p => p.id === sessionId);
                setCurrentPlayer(updatedCurrentPlayer || null);
              }
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Room subscription status:', status);
      });

    const playersSubscription = supabase
      .channel('players_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${params.id}` },
        async (payload) => {
          console.log('Players changed:', payload);
          const { data: playersData, error: playersError } = await supabase
            .from('players')
            .select()
            .eq('room_id', params.id);

          if (!playersError && playersData) {
            console.log('Updated players data:', playersData);
            setPlayers(playersData);
            // 現在のプレイヤーの情報も更新
            const sessionId = localStorage.getItem('sessionId');
            const currentPlayerData = playersData.find(p => p.id === sessionId);
            if (currentPlayerData) {
              console.log('Updated current player:', currentPlayerData);
              setCurrentPlayer(currentPlayerData);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Players subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscriptions...');
      roomSubscription.unsubscribe();
      playersSubscription.unsubscribe();
    };
  }, [params.id]);

  const startGame = async () => {
    if (!room || players.length < 3) {
      setError('ゲームを開始するには3人以上のプレイヤーが必要です');
      return;
    }

    try {
      // ランダムに1人をバグに選ぶ
      const bugIndex = Math.floor(Math.random() * players.length);
      console.log('Selected bug index:', bugIndex);
      
      // 選択された難易度のエンジニアワードをランダムに選択
      const { data: words, error: wordsError } = await supabase
        .from('engineering_words')
        .select()
        .eq('difficulty', selectedDifficulty);

      if (wordsError) {
        console.error('Failed to fetch words:', wordsError);
        throw wordsError;
      }

      if (!words || words.length === 0) {
        console.error('No words found for difficulty:', selectedDifficulty);
        throw new Error(`選択された難易度（${selectedDifficulty}）のワードが見つかりません`);
      }

      const selectedWord = words[Math.floor(Math.random() * words.length)];
      console.log('Selected word:', selectedWord.word);

      // プレイヤーの役職とワードを更新
      for (let i = 0; i < players.length; i++) {
        const { error: updateError } = await supabase
          .from('players')
          .update({
            role: i === bugIndex ? 'bug' : 'engineer',
            word: i === bugIndex ? 'バグ' : selectedWord.word,
          })
          .eq('id', players[i].id);

        if (updateError) {
          console.error(`Failed to update player ${players[i].id}:`, updateError);
          throw updateError;
        }
      }

      // 部屋のステータスを更新
      const { error: roomError } = await supabase
        .from('rooms')
        .update({
          status: 'playing',
          phase: 'discussion',
          difficulty: selectedDifficulty,
        })
        .eq('id', room.id);

      if (roomError) {
        console.error('Failed to update room:', roomError);
        throw roomError;
      }

      console.log('Game started successfully');
    } catch (err) {
      console.error('Game start error:', err);
      setError(err instanceof Error ? err.message : 'ゲームの開始に失敗しました');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">部屋が見つかりません</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">部屋コード: {room.code}</h1>
            <div className="text-sm text-gray-500">
              {room.current_players}/{room.max_players}人
            </div>
          </div>

          {room.status === 'waiting' && (
            <>
              <DifficultySelector
                difficulty={selectedDifficulty}
                onChange={setSelectedDifficulty}
                disabled={!currentPlayer || currentPlayer.id !== room.host_id}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="text-lg">
                  ステータス: 待機中
                </div>
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={players.length < 3 || !currentPlayer || currentPlayer.id !== room.host_id}
                >
                  ゲームを開始
                </button>
              </div>
            </>
          )}
          {room.status === 'playing' && (
            <div className="text-lg">
              ステータス: ゲーム中（{room.difficulty === 'beginner' ? '初級' : room.difficulty === 'intermediate' ? '中級' : '上級'}）
            </div>
          )}
        </div>

        {room.status === 'playing' && (
          <GamePhase
            room={room}
            players={players}
            currentPlayer={currentPlayer}
          />
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">プレイヤー一覧</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 border rounded-md text-center ${
                  currentPlayer?.id === player.id ? 'border-blue-500' : ''
                }`}
              >
                <p className="font-medium">{player.nickname}</p>
                {room.status === 'playing' && currentPlayer?.id === player.id && player.word && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">あなたのワード:</p>
                    <p className="text-sm text-gray-900">{player.word}</p>
                    {player.role === 'bug' && (
                      <p className="text-xs text-red-600 mt-1">あなたはバグです！</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {currentPlayer && (
          <LeaveButton
            room={room}
            currentPlayer={currentPlayer}
          />
        )}

        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}
      </div>
    </main>
  );
} 