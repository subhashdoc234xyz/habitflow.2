import InsightsDashboard from '../components/insights/InsightsDashboard';

export default function InsightsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Insights</h1>
        <p className="text-sm text-[var(--text-muted)]">Analytics and AI-powered insights</p>
      </div>
      <InsightsDashboard />
    </div>
  );
}
