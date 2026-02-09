import { Button } from "./ui/button";
import { Target } from "lucide-react";

interface FocusModeToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export function FocusModeToggle({ isActive, onToggle }: FocusModeToggleProps) {
  return (
    <div className="flex justify-center mb-6">
      <Button
        onClick={onToggle}
        variant={isActive ? "default" : "outline"}
        className={`
          w-full max-w-sm h-12 text-base font-medium transition-all duration-300
          ${isActive 
            ? "bg-[#042861] hover:bg-[#042861]/90 text-white shadow-lg shadow-[#042861]/20" 
            : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          }
        `}
      >
        <Target className={`w-4 h-4 mr-2 ${isActive ? "text-white" : "text-zinc-400"}`} />
        {isActive ? "Exit Focus Mode" : "Enter Focus Mode"}
      </Button>
    </div>
  );
}