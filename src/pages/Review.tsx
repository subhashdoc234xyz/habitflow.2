import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';

export function Review() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="mb-2">
        <h1 className="heading-1 mb-1">Weekly Review</h1>
        <p className="text-gray-500 font-medium">Reflect on your progress and set intentions</p>
      </div>

      <GlassCard>
        <h3 className="heading-2 mb-4">How was your week?</h3>
        <div className="flex gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} className="text-4xl hover:scale-110 transition-transform grayscale hover:grayscale-0 focus:grayscale-0">
              ⭐
            </button>
          ))}
        </div>
        
        <h3 className="heading-2 mb-4 mt-8">What went well?</h3>
        <textarea 
          className="w-full bg-white/50 border border-white/80 rounded-xl p-4 text-gray-700 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
          placeholder="I was very consistent with my morning routine..."
        ></textarea>

        <h3 className="heading-2 mb-4 mt-8">What could be better?</h3>
        <textarea 
          className="w-full bg-white/50 border border-white/80 rounded-xl p-4 text-gray-700 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
          placeholder="I struggled with going to bed on time..."
        ></textarea>

        <div className="mt-8 flex justify-end">
          <PrimaryButton>Submit Review</PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}
