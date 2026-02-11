import { Flame, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface HomeSectionProps {
  tasks: { done: boolean }[];
  studyHours: number;
}

const HomeSection = ({ tasks, studyHours }: HomeSectionProps) => {
  const [currentStreak, setCurrentStreak] = useState(0);

  const completedTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;

  useEffect(() => {
    const stored = localStorage.getItem("study-streak");
    const data = stored ? JSON.parse(stored) : [];
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = data.find((s: { date: string; intensity: number }) => s.date === dateStr);
      if (found && found.intensity > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    setCurrentStreak(streak);
  }, [tasks]);

  const stats = [
    {
      icon: Flame,
      label: "Day Streak",
      value: currentStreak,
      color: "gradient-primary",
    },
    {
      icon: CheckCircle,
      label: "Tasks Done",
      value: `${completedTasks}/${totalTasks}`,
      color: "gradient-accent",
    },
    {
      icon: Clock,
      label: "Hours Planned",
      value: studyHours,
      color: "bg-secondary",
    },
  ];

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-foreground">Welcome back! 👋</h2>
        <p className="text-muted-foreground mt-2">Ready to crush your study goals today?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-xl p-6 text-center space-y-3">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto`}>
                <Icon size={24} className="text-primary-foreground" />
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeSection;
