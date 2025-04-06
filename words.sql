-- エンジニアリングワードテーブルの作成
CREATE TABLE engineering_words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 難易度: 初学者
INSERT INTO engineering_words (word, difficulty, description) VALUES
('HTML', 'beginner', 'Webページの構造を定義するマークアップ言語。タグを使って文書の構造を表現する'),
('CSS', 'beginner', 'Webページのスタイルやレイアウトを定義する言語。色、フォント、配置などを指定する'),
('JavaScript', 'beginner', 'Webブラウザで動作するスクリプト言語。動的なWebページの作成やユーザー操作の処理を行う'),
('Python', 'beginner', '初心者に優しい汎用プログラミング言語。読みやすく書きやすい文法が特徴'),
('Variable', 'beginner', 'データを一時的に保存するための箱。プログラム内で値を保持するために使用する'),
('Function', 'beginner', '特定の処理をまとめて名前をつけたもの。再利用可能なコードブロック'),
('Loop', 'beginner', '同じ処理を繰り返し実行する制御構造。for文やwhile文などがある'),
('Condition', 'beginner', '条件に基づいて処理を分岐させる制御構造。if文などがある'),
('Array', 'beginner', '複数のデータを順序付けて格納するデータ構造。インデックスで要素にアクセスする'),
('Object', 'beginner', 'データとその振る舞いをまとめたもの。プロパティとメソッドを持つ'),
('Git', 'beginner', 'ソースコードの変更履歴を管理するバージョン管理システム。チーム開発に必須'),
('VSCode', 'beginner', 'Microsoftが開発した高機能なコードエディタ。多くの拡張機能をサポート'),
('Typo', 'beginner', 'タイプミスによるエラー。変数名や関数名のスペルミスなど'),
('MissingBracket', 'beginner', '括弧の不足によるエラー。開始括弧と終了括弧の数が一致しない'),
('WrongIndent', 'beginner', 'インデントの間違いによるエラー。コードの階層構造が正しくない');

-- 難易度: 中級者
INSERT INTO engineering_words (word, difficulty, description) VALUES
('React', 'intermediate', 'Facebookが開発したJavaScriptのUIライブラリ。コンポーネントベースの開発を可能にする'),
('Vue', 'intermediate', 'プログレッシブなJavaScriptフレームワーク。段階的な導入が可能'),
('TypeScript', 'intermediate', 'JavaScriptに型システムを追加した言語。大規模開発に適している'),
('Node.js', 'intermediate', 'サーバーサイドでJavaScriptを実行する環境。非同期処理が得意'),
('MySQL', 'intermediate', '人気のリレーショナルデータベース。SQLを使用してデータを管理する'),
('MongoDB', 'intermediate', 'ドキュメント指向のNoSQLデータベース。柔軟なスキーマ設計が可能'),
('Docker', 'intermediate', 'アプリケーションをコンテナ化するプラットフォーム。環境の再現性を確保する'),
('API', 'intermediate', 'アプリケーション間のインターフェース。データのやり取りの規約を定義する'),
('Class', 'intermediate', 'オブジェクトの設計図。データと振る舞いをカプセル化する'),
('Method', 'intermediate', 'クラスに属する関数。オブジェクトの振る舞いを定義する'),
('Parameter', 'intermediate', '関数に渡す値。関数の動作をカスタマイズするために使用する'),
('Return', 'intermediate', '関数の実行結果を返すこと。処理の結果を呼び出し元に渡す'),
('UndefinedVar', 'intermediate', '未定義の変数を参照するエラー。変数が宣言されていない'),
('WrongPath', 'intermediate', 'ファイルパスの間違いによるエラー。ファイルの場所が正しくない'),
('CaseSensitive', 'intermediate', '大文字小文字を区別すること。変数名やファイル名で重要'),
('Go', 'intermediate', 'Googleが開発したコンパイル型のプログラミング言語。並行処理が得意'),
('Gin', 'intermediate', 'Go言語の軽量Webフレームワーク。高速なルーティングとミドルウェアを提供'),
('Echo', 'intermediate', 'Go言語の高性能なWebフレームワーク。シンプルで拡張性が高い'),
('Fiber', 'intermediate', 'Go言語の高速Webフレームワーク。Express.jsライクなAPIを持つ'),
('GORM', 'intermediate', 'Go言語のORMライブラリ。データベース操作を簡単にする'),
('Goroutine', 'intermediate', 'Go言語の軽量スレッド。並行処理を実現する基本単位'),
('Channel', 'intermediate', 'Go言語の並行処理機能。Goroutine間でデータをやり取りする'),
('Interface', 'intermediate', 'Go言語のインターフェース。型の振る舞いを定義する抽象化'),
('Pointer', 'intermediate', 'Go言語のポインタ。メモリ上のアドレスを参照する'),
('Slice', 'intermediate', 'Go言語のスライス。動的な配列のようなデータ構造'),
('Map', 'intermediate', 'Go言語のマップ。キーと値のペアを格納するデータ構造'),
('Struct', 'intermediate', 'Go言語の構造体。異なる型のデータをまとめる'),
('Error', 'intermediate', 'Go言語のエラー処理。エラーを明示的に扱う'),
('Context', 'intermediate', 'Go言語のコンテキスト。リクエストのスコープやキャンセルを管理'),
('Middleware', 'intermediate', 'Go言語のミドルウェア。リクエスト処理の前後に処理を追加');

-- 難易度: 上級者
INSERT INTO engineering_words (word, difficulty, description) VALUES
('Kubernetes', 'advanced', 'コンテナ化されたアプリケーションの自動デプロイ、スケーリング、運用を管理するプラットフォーム'),
('Microservices', 'advanced', 'アプリケーションを小さな独立したサービスに分割するアーキテクチャパターン'),
('GraphQL', 'advanced', 'APIのためのクエリ言語。クライアントが必要なデータだけを要求できる'),
('Redis', 'advanced', 'インメモリデータストア。高速なキャッシュやセッション管理に使用'),
('Elasticsearch', 'advanced', '分散検索エンジン。大規模なデータの全文検索が可能'),
('Terraform', 'advanced', 'インフラストラクチャをコードとして管理するツール。クラウドリソースの自動化'),
('CI/CD', 'advanced', '継続的インテグレーション/デリバリー。自動ビルド、テスト、デプロイを実現'),
('LoadBalancer', 'advanced', '負荷分散装置。トラフィックを複数のサーバーに振り分ける'),
('RaceCondition', 'advanced', '並行処理における競合状態。予期しない動作を引き起こす'),
('Deadlock', 'advanced', '複数のプロセスが互いにリソースを待ち合う状態。処理が停止する'),
('MemoryLeak', 'advanced', 'メモリリーク。使用しなくなったメモリが解放されない問題'),
('BufferOverflow', 'advanced', 'バッファオーバーフロー。割り当てられたメモリ領域を超えて書き込む問題'),
('NullPointerException', 'advanced', 'null参照によるエラー。存在しないオブジェクトにアクセスしようとする'),
('StackOverflow', 'advanced', 'スタックのオーバーフロー。再帰呼び出しが深すぎる問題'),
('OutOfMemory', 'advanced', 'メモリ不足エラー。利用可能なメモリを使い切る問題'),
('GoGC', 'advanced', 'Go言語のガベージコレクション。使用されなくなったメモリを自動的に解放する'),
('GoProfiler', 'advanced', 'Go言語のプロファイリング。パフォーマンス分析ツール'),
('GoRace', 'advanced', 'Go言語のレース検出。並行処理における競合状態を検出する'),
('GoTest', 'advanced', 'Go言語のテスト。ユニットテストや統合テストを実行する'),
('GoBenchmark', 'advanced', 'Go言語のベンチマーク。コードのパフォーマンスを測定する'),
('GoModule', 'advanced', 'Go言語のモジュール。依存関係を管理する仕組み'),
('GoVendor', 'advanced', 'Go言語のベンダー。依存パッケージをプロジェクト内にコピーする'),
('GoWork', 'advanced', 'Go言語のワークスペース。複数のモジュールを管理する仕組み'),
('GoTool', 'advanced', 'Go言語のツール。開発を支援する各種コマンド'),
('GoPlugin', 'advanced', 'Go言語のプラグイン。動的にロード可能な拡張機能'),
('GoCGO', 'advanced', 'Go言語のCGO。C言語のコードを呼び出す仕組み'),
('GoAssembly', 'advanced', 'Go言語のアセンブリ。低レベルな最適化に使用'),
('GoReflect', 'advanced', 'Go言語のリフレクション。実行時に型情報を扱う仕組み'),
('GoUnsafe', 'advanced', 'Go言語のunsafeパッケージ。型安全性をバイパスする低レベル操作'),
('GoSyscall', 'advanced', 'Go言語のシステムコール。OSの機能を直接呼び出す');

-- インデックスの作成
CREATE INDEX idx_engineering_words_difficulty ON engineering_words(difficulty);
CREATE INDEX idx_engineering_words_word ON engineering_words(word); 