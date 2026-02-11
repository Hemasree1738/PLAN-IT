import { useState } from "react";
import StudySidebar, { type Section } from "@/components/StudySidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import HomeSection from "@/components/HomeSection";
import TimetableSection from "@/components/TimetableSection";
import MusicSection from "@/components/MusicSection";
import TodoSection from "@/components/TodoSection";
import ProgressSection from "@/components/ProgressSection";
import ReminderSection from "@/components/ReminderSection";
import StreakSection from "@/components/StreakSection";

interface Subject {
  name: string;
  difficulty: number;
}

interface TimetableEntry {
  subject: string;
  difficulty: number;
  duration: number;
  isBreak?: boolean;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [studyHours, setStudyHours] = useState(3);
  const [order, setOrder] = useState("hard-easy");
  const [tasks, setTasks] = useState<Task[]>([]);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection tasks={tasks} studyHours={studyHours} />;
      case "timetable":
        return (
          <TimetableSection
            subjects={subjects} setSubjects={setSubjects}
            timetable={timetable} setTimetable={setTimetable}
            studyHours={studyHours} setStudyHours={setStudyHours}
            order={order} setOrder={setOrder}
          />
        );
      case "music":
        return <MusicSection />;
      case "todo":
        return <TodoSection tasks={tasks} setTasks={setTasks} />;
      case "progress":
        return <ProgressSection tasks={tasks} />;
      case "streak":
        return <StreakSection tasks={tasks} />;
      case "reminder":
        return <ReminderSection />;
      default:
        return <HomeSection tasks={tasks} studyHours={studyHours} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <StudySidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
      <main className="flex-1 p-4 sm:p-8 max-w-4xl pb-24 md:pb-8">
        {renderSection()}
      </main>
      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <MobileBottomNav activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
    </div>
  );
};

export default Index;
