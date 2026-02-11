import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Sparkles, Play, Pause, RotateCcw, Timer } from "lucide-react";

interface Subject {
  name: string;
  difficulty: number;
}

interface TimetableEntry {
  subject: string;
  difficulty: number;
  duration: number; // in minutes
  isBreak?: boolean;
}

interface TimetableProps {
  subjects: Subject[];
  setSubjects: (s: Subject[]) => void;
  timetable: TimetableEntry[];
  setTimetable: (t: TimetableEntry[]) => void;
  studyHours: number;
  setStudyHours: (h: number) => void;
  order: string;
  setOrder: (o: string) => void;
}

const TimetableSection = ({
  subjects, setSubjects, timetable, setTimetable,
  studyHours, setStudyHours, order, setOrder
}: TimetableProps) => {
  const [newSubject, setNewSubject] = useState("");
  const [newDifficulty, setNewDifficulty] = useState(2);
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
      setIsRunning(false);
            setShowReminder(true);
            // Play buzzer sound
            try {
              const ctx = new AudioContext();
              const now = ctx.currentTime;
              for (let b = 0; b < 3; b++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.value = 880;
                gain.gain.setValueAtTime(0.3, now + b * 0.25);
                gain.gain.exponentialRampToValueAtTime(0.001, now + b * 0.25 + 0.2);
                osc.connect(gain).connect(ctx.destination);
                osc.start(now + b * 0.25);
                osc.stop(now + b * 0.25 + 0.2);
              }
            } catch {}
            setTimeout(() => setShowReminder(false), 5000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const addSubject = () => {
    if (!newSubject.trim()) return;
    setSubjects([...subjects, { name: newSubject.trim(), difficulty: newDifficulty }]);
    setNewSubject("");
    setNewDifficulty(2);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const generateTimetable = useCallback(() => {
    if (subjects.length === 0 || studyHours <= 0) return;

    const totalWeight = subjects.reduce((sum, s) => sum + s.difficulty, 0);
    const totalMinutes = studyHours * 60;

    let sorted = [...subjects];
    if (order === "easy-hard") {
      sorted.sort((a, b) => a.difficulty - b.difficulty);
    } else if (order === "hard-easy") {
      sorted.sort((a, b) => b.difficulty - a.difficulty);
    } else {
      // random shuffle
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
    }

    const breakDuration = 10; // 10 min breaks
    const numBreaks = sorted.length - 1;
    const studyMinutes = totalMinutes - numBreaks * breakDuration;

    const entries: TimetableEntry[] = [];
    sorted.forEach((sub, idx) => {
      const duration = Math.round((sub.difficulty / totalWeight) * studyMinutes);
      entries.push({ subject: sub.name, difficulty: sub.difficulty, duration });
      if (idx < sorted.length - 1) {
        entries.push({ subject: "Break", difficulty: 0, duration: breakDuration, isBreak: true });
      }
    });

    setTimetable(entries);
  }, [subjects, studyHours, order, setTimetable]);

  const startTimer = (index: number, duration: number) => {
    setActiveTimerIndex(index);
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setShowReminder(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const difficultyLabels = ["", "Easy", "Medium", "Hard"];
  const difficultyColors = ["", "text-accent", "text-secondary", "text-primary"];

  return (
    <div className="animate-slide-in space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Smart Timetable ⏰</h2>

      {showReminder && (
        <div className="gradient-accent text-primary-foreground rounded-xl p-4 text-center font-display font-semibold text-lg animate-pulse-glow">
          🎉 End of the session! Great work!
        </div>
      )}

      {/* Add Subject */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-card-foreground">Add Subjects</h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground mb-1 block">Subject Name</label>
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubject()}
              placeholder="e.g. Mathematics"
              className="w-full px-3 py-2 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="w-36">
            <label className="text-xs text-muted-foreground mb-1 block">Difficulty (1-3)</label>
            <select
              value={newDifficulty}
              onChange={(e) => setNewDifficulty(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={1}>1 - Easy</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - Hard</option>
            </select>
          </div>
          <button onClick={addSubject} className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add
          </button>
        </div>

        {subjects.length > 0 && (
          <div className="space-y-2 mt-3">
            {subjects.map((sub, i) => (
              <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-foreground">{sub.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${difficultyColors[sub.difficulty]}`}>
                    {difficultyLabels[sub.difficulty]}
                  </span>
                  <button onClick={() => removeSubject(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-card-foreground">Settings</h3>
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Study Hours</label>
            <input
              type="number"
              min={1}
              max={12}
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Study Order</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="px-3 py-2 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="hard-easy">Hard → Easy</option>
              <option value="easy-hard">Easy → Hard</option>
              <option value="random">Random</option>
            </select>
          </div>
        </div>
        <button onClick={generateTimetable} className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Sparkles size={16} /> Generate Timetable
        </button>
      </div>

      {/* Generated Timetable */}
      {timetable.length > 0 && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2">
            <Timer size={18} /> Your Study Schedule
          </h3>
          <div className="space-y-2">
            {timetable.map((entry, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                  entry.isBreak
                    ? "bg-cotton-candy/20 border border-cotton-candy/30"
                    : "bg-muted/50 border border-border/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${entry.isBreak ? "text-cotton-candy-foreground" : "text-foreground"}`}>
                    {entry.isBreak ? "☕ " : "📖 "}{entry.subject}
                  </span>
                  {!entry.isBreak && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.difficulty === 3 ? "bg-primary/15 text-primary" :
                      entry.difficulty === 2 ? "bg-secondary/15 text-secondary" :
                      "bg-accent/20 text-accent-foreground"
                    }`}>
                      {difficultyLabels[entry.difficulty]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-mono">{entry.duration} min</span>
                  {activeTimerIndex === i && isRunning ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-primary">{formatTime(timeLeft)}</span>
                      <button onClick={() => setIsRunning(false)} className="text-muted-foreground hover:text-foreground">
                        <Pause size={14} />
                      </button>
                    </div>
                  ) : activeTimerIndex === i && !isRunning && timeLeft > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">{formatTime(timeLeft)}</span>
                      <button onClick={() => setIsRunning(true)} className="text-primary hover:opacity-80">
                        <Play size={14} />
                      </button>
                      <button onClick={() => { setActiveTimerIndex(null); setTimeLeft(0); }} className="text-muted-foreground hover:text-foreground">
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTimer(i, entry.duration)}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Play size={12} /> Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableSection;
