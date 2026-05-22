import { TrendingUp, AlertTriangle, Info, AlertCircle, BarChart3, Target, CheckCircle, Brain } from 'lucide-react';

const toneConfig = {
  positive: { icon: <TrendingUp size={18} />, bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  warning: { icon: <AlertTriangle size={18} />, bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  danger: { icon: <AlertCircle size={18} />, bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  info: { icon: <Info size={18} />, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const categoryIcons = {
  Habits: <BarChart3 size={14} />,
  Goals: <Target size={14} />,
  Todos: <CheckCircle size={14} />,
  Mood: <Brain size={14} />,
};

const categoryColors = {
  Habits: 'bg-accent/15 text-accent-light',
  Goals: 'bg-green-500/15 text-green-400',
  Todos: 'bg-amber-500/15 text-amber-400',
  Mood: 'bg-purple-500/15 text-purple-400',
};

export default function RuleBasedInsights({ insights }) {
  if (!insights || insights.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-muted)] text-sm">
        No insights available yet. Start tracking to see your personalized insights!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, idx) => {
        const tone = toneConfig[insight.tone] || toneConfig.info;
        return (
          <div
            key={idx}
            className={`flex items-start gap-3 p-4 rounded-xl border ${tone.bg} ${tone.border} animate-fade-in`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`flex-shrink-0 ${tone.text}`}>
              {tone.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[insight.category] || categoryColors.Habits}`}>
                  {categoryIcons[insight.category]} {insight.category}
                </span>
              </div>
              <p className={`text-sm font-medium ${tone.text}`}>{insight.headline}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{insight.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
