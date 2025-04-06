import type { WordDifficulty } from '@/types/game';

interface DifficultySelectorProps {
  difficulty: WordDifficulty;
  onChange: (difficulty: WordDifficulty) => void;
  disabled?: boolean;
}

export function DifficultySelector({ difficulty, onChange, disabled }: DifficultySelectorProps) {
  const difficulties: { value: WordDifficulty; label: string; description: string }[] = [
    {
      value: 'beginner',
      label: '初級',
      description: 'HTML, CSS, 変数など、プログラミングの基本的な用語',
    },
    {
      value: 'intermediate',
      label: '中級',
      description: 'React, Docker, APIなど、実務でよく使用する用語',
    },
    {
      value: 'advanced',
      label: '上級',
      description: 'Kubernetes, マイクロサービス, 分散システムなど、高度な用語',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">難易度選択</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {difficulties.map(({ value, label, description }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            disabled={disabled}
            className={`p-4 border rounded-lg text-left transition-colors ${
              difficulty === value
                ? 'border-blue-500 bg-blue-50'
                : 'hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">{label}</div>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
} 