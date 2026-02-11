interface ProgressProps {
  tasks: { done: boolean }[];
}

const ProgressSection = ({ tasks }: ProgressProps) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const remaining = total - completed;

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="animate-slide-in space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Progress Tracker 📊</h2>

      {total === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <p className="text-muted-foreground">Add tasks in your To-Do list to track progress here.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-8 flex flex-col items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" strokeWidth="10" className="stroke-muted" />
              <circle
                cx="80" cy="80" r="70" fill="none" strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="stroke-primary transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold text-foreground">{percentage}%</span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-primary">{completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-2xl font-display font-bold text-secondary">{remaining}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
