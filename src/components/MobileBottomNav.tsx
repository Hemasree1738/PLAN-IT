import * as React from "react";

type Props = {
  activeSection: string;
  onSectionChange: (s: string) => void;
};

export default function MobileBottomNav({ activeSection, onSectionChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <ul className="flex justify-around p-2">
        {[
          ["home", "Home"],
          ["timetable", "Timetable"],
          ["music", "Music"],
          ["todo", "Todo"],
        ].map(([key, label]) => (
          <li key={key}>
            <button
              className={
                "px-3 py-2 rounded-md " + (activeSection === key ? "font-semibold" : "text-muted-foreground")
              }
              onClick={() => onSectionChange(key)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
