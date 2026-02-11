import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

interface TodoProps {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
}

const TodoSection = ({ tasks, setTasks }: TodoProps) => {
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="animate-slide-in space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">To-Do List ✅</h2>

      {tasks.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {completedCount} of {tasks.length} tasks completed
        </p>
      )}

      {/* Add task */}
      <div className="flex gap-3">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={addTask} className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No tasks yet. Add one above! 📝
          </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`glass-card rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
              task.done ? "opacity-60" : ""
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                task.done
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary"
              }`}
            >
              {task.done && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.text}
            </span>
            <button onClick={() => removeTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoSection;
