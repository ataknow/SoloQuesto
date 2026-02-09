import { useState } from "react";
import { Mic, Camera, Plus } from "lucide-react";
import { useVoiceInput } from "../hooks/useVoiceInput";

interface AddTaskInputProps {
  onAddTask: (task: { title: string; note?: string }) => void;
  // onImportTasks rimosso
  isDark: boolean;
}

export function AddTaskInput({ onAddTask, isDark }: AddTaskInputProps) {
  const [title, setTitle] = useState("");
  const { isListening, startListening, stopListening } = useVoiceInput();

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask({ title: title.trim() });
      setTitle("");
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        const text = await startListening();
        if (text) {
          setTitle(title + (title ? " " : "") + text);
        }
      } catch (error) {
        console.error("Voice input error:", error);
      }
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const mockExtractedText = prompt(
          "OCR Preview - Edit extracted text:",
          "Buy milk\\nCall mom\\nFinish report"
        );
        if (mockExtractedText) {
          const lines = mockExtractedText.split("\\n").filter((line) => line.trim());
          lines.forEach((line) => onAddTask({ title: line.trim() }));
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full h-12 px-4 pr-24 bg-zinc-900 border-2 border-zinc-800 rounded-2xl text-base focus:outline-none focus:border-[#042861] text-white placeholder:text-zinc-500 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={handleVoiceInput}
              className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                isListening
                  ? "bg-[#042861] text-white animate-pulse"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={handleCameraCapture}
              className="h-9 w-9 rounded-xl bg-zinc-800 text-zinc-500 flex items-center justify-center transition-all active:scale-90"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="h-12 w-12 bg-[#042861] text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
