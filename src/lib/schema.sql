-- rooms テーブル
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('waiting', 'playing', 'finished')),
  phase TEXT CHECK (phase IN ('discussion', 'voting')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 8,
  current_players INTEGER NOT NULL DEFAULT 0,
  host_id UUID NOT NULL
);

-- players テーブル
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  role TEXT CHECK (role IN ('engineer', 'bug')),
  word TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- votes テーブル
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックス
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_players_room_id ON players(room_id);
CREATE INDEX idx_votes_room_id ON votes(room_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);
CREATE INDEX idx_votes_target_id ON votes(target_id);

-- RLSポリシー
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- rooms のポリシー
CREATE POLICY "誰でも部屋を作成できる" ON rooms
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "誰でも部屋を閲覧できる" ON rooms
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "ホストのみ部屋を更新できる" ON rooms
  FOR UPDATE TO anon
  USING (host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());

-- players のポリシー
CREATE POLICY "誰でもプレイヤーを作成できる" ON players
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "誰でもプレイヤーを閲覧できる" ON players
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "プレイヤー自身のみ更新できる" ON players
  FOR UPDATE TO anon
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- votes のポリシー
CREATE POLICY "誰でも投票を作成できる" ON votes
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "誰でも投票を閲覧できる" ON votes
  FOR SELECT TO anon
  USING (true); 