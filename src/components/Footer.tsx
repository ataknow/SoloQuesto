import { Upload, Download, Settings } from "lucide-react";

interface FooterProps {
  isDark: boolean;
}

export function Footer({ isDark }: FooterProps) {
  return (
    <footer className={`border-t p-4 flex justify-around items-center ${
      isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-stone-200"
    }`}>
      <button className={`flex flex-col items-center gap-1 transition-colors ${
        isDark ? "text-zinc-400 hover:text-white" : "text-stone-500 hover:text-stone-900"
      }`}>
        <Upload className="w-5 h-5" />
        <span className="text-xs">Import</span>
      </button>
      
      <button className={`flex flex-col items-center gap-1 transition-colors ${
        isDark ? "text-zinc-400 hover:text-white" : "text-stone-500 hover:text-stone-900"
      }`}>
        <Download className="w-5 h-5" />
        <span className="text-xs">Export</span>
      </button>
      
      <button className={`flex flex-col items-center gap-1 transition-colors ${
        isDark ? "text-zinc-400 hover:text-white" : "text-stone-500 hover:text-stone-900"
      }`}>
        <Settings className="w-5 h-5" />
        <span className="text-xs">Settings</span>
      </button>
    </footer>
  );
}