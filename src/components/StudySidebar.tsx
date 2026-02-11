import { Home, Clock, Music, CheckSquare, BarChart3, Bell, Flame } from "lucide-react";

type Section = "home" | "timetable" | "music" | "todo" | "progress" | "reminder" | "streak";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "timetable", label: "Timetable", icon: Clock },
  { id: "music", label: "Music", icon: Music },
  { id: "todo", label: "To-Do List", icon: CheckSquare },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "streak", label: "Streak", icon: Flame },
  { id: "reminder", label: "Reminder", icon: Bell },
];

const StudySidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="w-64 min-h-screen gradient-sidebar flex flex-col py-6 px-3">
      <div className="px-3 mb-8">
        <h1 className="text-xl font-display font-bold text-sidebar-foreground tracking-tight">
          📚 Plan it
        </h1>
        <p className="text-xs text-sidebar-muted mt-1">Plan. Focus. Achieve.</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default StudySidebar;
export type { Section };
