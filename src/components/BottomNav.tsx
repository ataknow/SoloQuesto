import { Home, Settings, Upload } from "lucide-react";

interface BottomNavProps {
  currentView: string;
  onTabChange: (view: string) => void;
  isDark: boolean;
}

export function BottomNav({ currentView, onTabChange, isDark }: BottomNavProps) {
  const tabs = [
    { id: "lists", label: "Lists", icon: Home },
    { id: "import", label: "Import", icon: Upload },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`h-20 border-t flex items-center justify-around px-6 shrink-0 z-30 transition-colors duration-300 ${
      isDark 
        ? "bg-[#1A1A1A] border-zinc-800" 
        : "bg-stone-50 border-stone-200"
    }`}>
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 p-2 transition-colors w-20"
          >
            <tab.icon className={`w-6 h-6 ${isActive ? "text-[#042861]" : isDark ? "text-zinc-500" : "text-stone-500"}`} />
            <span className={`text-xs ${isActive ? "font-medium" : ""} ${isActive ? (isDark ? "text-white" : "text-stone-900") : (isDark ? "text-zinc-500" : "text-stone-500")}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}