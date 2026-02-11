import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

interface StreakDay {
  date: string;
  intensity: number; // 0-4: none, light, medium, strong, intense
}

interface StreakProps {
  tasks: { done: boolean }[];
}

const StreakSection = ({ tasks }: StreakProps) => {
  const [streakData, setStreakData] = useState<StreakDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem("study-streak");
    let data: StreakDay[] = stored ? JSON.parse(stored) : [];

    // Update today's entry based on completed tasks
    const today = new Date().toISOString().split("T")[0];
    const completedCount = tasks.filter((t) => t.done).length;
    const totalTasks = tasks.length;
    
    let intensity = 0;
    if (totalTasks > 0) {
      const ratio = completedCount / totalTasks;
      if (ratio > 0.75) intensity = 4;
      else if (ratio > 0.5) intensity = 3;
      else if (ratio > 0.25) intensity = 2;
      else if (ratio > 0) intensity = 1;
    }

    const existingIdx = data.findIndex((d) => d.date === today);
    if (existingIdx >= 0) {
      data[existingIdx].intensity = intensity;
    } else if (intensity > 0) {
      data.push({ date: today, intensity });
    }

    localStorage.setItem("study-streak", JSON.stringify(data));
    setStreakData(data);

    // Calculate current streak
    let streak = 0;
    const todayDate = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = data.find((s) => s.date === dateStr);
      if (found && found.intensity > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    setCurrentStreak(streak);
  }, [tasks]);

  // Generate last 16 weeks (112 days) grid
  const weeks = 16;
  const days = weeks * 7;
  const grid: { date: string; intensity: number; dayOfWeek: number }[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = streakData.find((s) => s.date === dateStr);
    grid.push({
      date: dateStr,
      intensity: found ? found.intensity : 0,
      dayOfWeek: d.getDay(),
    });
  }

  const intensityColors = [
    "bg-streak-empty",
    "bg-streak-light",
    "bg-streak-medium",
    "bg-streak-strong",
    "bg-streak-intense",
  ];

  // Group into weeks
  const weekGroups: typeof grid[] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weekGroups.push(grid.slice(i, i + 7));
  }

  return (
    <div className="animate-slide-in space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Streak 🔥</h2>

      {/* Current streak */}
      <div className="glass-card rounded-xl p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
          <Flame size={28} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-3xl font-display font-bold text-foreground">{currentStreak}</p>
          <p className="text-sm text-muted-foreground">day streak</p>
        </div>
      </div>

      {/* Contribution grid */}
      <div className="glass-card rounded-xl p-5 overflow-x-auto">
        <div className="flex gap-1 min-w-fit">
          {weekGroups.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${intensityColors[day.intensity]} transition-colors`}
                  title={`${day.date}: ${["No activity", "Light", "Medium", "Strong", "Intense"][day.intensity]}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          {intensityColors.map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default StreakSection;
