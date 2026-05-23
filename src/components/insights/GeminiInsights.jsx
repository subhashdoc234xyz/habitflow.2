import { useState } from 'react';
import { Sparkles, RefreshCw, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { generateInsights, getCachedInsights, setCachedInsights } from '../../lib/gemini';

export default function GeminiInsights({ geminiData }) {
  const [insights, setInsights] = useState(getCachedInsights);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(() => {
    try {
      const cached = localStorage.getItem('habitflow_gemini_cache');
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        return new Date(timestamp).toLocaleString();
      }
    } catch {}
    return null;
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateInsights(geminiData);
      setInsights(result);
      setCachedInsights(result);
      setLastGenerated(new Date().toLocaleString());
      toast.success('AI insights generated! ✨');
    } catch (error) {
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">AI Coach Insights</h3>
          <p className="text-xs text-[var(--text-muted)]">Powered by Gemini AI</p>
        </div>
        <Button
          onClick={handleGenerate}
          loading={loading}
          disabled={!geminiData}
          className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] border-0 text-white font-semibold rounded-[12px] shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-coach-pulse hover:brightness-110 active:scale-[0.97]"
        >
          <Sparkles size={14} />
          {insights ? 'Refresh Insights' : 'Generate AI Insights'}
        </Button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--bg-hover)] rounded-xl p-4">
              <div className="h-4 bg-[var(--border)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--border)] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {insights && !loading && (
        <div className="bg-gradient-to-br from-accent/5 to-purple-500/5 border border-accent/20 rounded-xl p-5">
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <Sparkles size={14} className="text-accent-light mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--text-primary)]">{insight}</p>
              </div>
            ))}
          </div>

          {lastGenerated && (
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-accent/10">
              <Clock size={12} className="text-[var(--text-muted)]" />
              <span className="text-[10px] text-[var(--text-muted)]">Last generated: {lastGenerated}</span>
            </div>
          )}
        </div>
      )}

      {!insights && !loading && (
        <div className="text-center py-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <Sparkles size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-1">Get personalized AI insights</p>
          <p className="text-xs text-[var(--text-muted)]">Analyze your habits, mood, and productivity trends</p>
        </div>
      )}
    </div>
  );
}
