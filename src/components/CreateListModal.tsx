import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  isDark: boolean;
}

export function CreateListModal({ isOpen, onClose, onCreate, isDark }: CreateListModalProps) {
  const [name, setName] = useState("");

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
    } else {
      // Focus input when modal opens
      setTimeout(() => {
        const input = document.getElementById("new-list-input");
        input?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all ${
        isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-stone-200"
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
            isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-stone-100 text-stone-400"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-stone-900"}`}>
          New List
        </h2>
        <p className={`text-sm mb-6 ${isDark ? "text-zinc-500" : "text-stone-500"}`}>
          Give your new list a name to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="new-list-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Groceries, Work Ideas..."
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#042861] transition-all ${
                isDark 
                  ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600" 
                  : "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400"
              }`}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                isDark 
                  ? "text-zinc-400 hover:text-white hover:bg-zinc-800" 
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 rounded-xl font-medium text-white bg-[#042861] hover:bg-[#042861]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#042861]/20"
            >
              Create List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}