import { Upload, FileText, Mic, Camera } from "lucide-react";

interface ImportExportProps {
  onImport: (file: File) => void;
  onExport: (format: "txt") => void;
  onVoiceImport: () => void;
  onPhotoImport: () => void;
  isDark: boolean;
}

export function ImportExport({ onImport, onExport, onVoiceImport, onPhotoImport, isDark }: ImportExportProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className={`p-6 pb-24 min-h-full transition-colors duration-300 ${
      isDark ? "bg-[#1A1A1A]" : "bg-stone-50"
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-stone-900"}`}>Import & Export</h2>
      
      <div className="space-y-4">
        {/* Import Section */}
        <div className={`rounded-2xl p-4 border transition-colors ${
          isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-stone-200"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-stone-900"}`}>Import Tasks</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => document.getElementById("file-input")?.click()}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl transition-colors border ${
                isDark 
                  ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700" 
                  : "bg-stone-50 hover:bg-stone-100 border-stone-200"
              }`}
            >
              <FileText className="w-8 h-8 text-[#042861]" />
              <span className={`text-sm ${isDark ? "text-zinc-300" : "text-stone-700"}`}>Import .txt</span>
            </button>
            
            <button
              onClick={onVoiceImport}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl transition-colors border ${
                isDark 
                  ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700" 
                  : "bg-stone-50 hover:bg-stone-100 border-stone-200"
              }`}
            >
              <Mic className="w-8 h-8 text-[#042861]" />
              <span className={`text-sm ${isDark ? "text-zinc-300" : "text-stone-700"}`}>Voice Input</span>
            </button>

            <button
              onClick={onPhotoImport}
              className={`col-span-2 flex flex-col items-center justify-center gap-2 p-6 rounded-xl transition-colors border ${
                isDark 
                  ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700" 
                  : "bg-stone-50 hover:bg-stone-100 border-stone-200"
              }`}
            >
              <Camera className="w-8 h-8 text-[#042861]" />
              <span className={`text-sm ${isDark ? "text-zinc-300" : "text-stone-700"}`}>Scan Paper List</span>
            </button>
          </div>
          
          <input
            id="file-input"
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Export Section */}
        <div className={`rounded-2xl p-4 border transition-colors ${
          isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-stone-200"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-stone-900"}`}>Export List</h3>
          
          <button
            onClick={() => onExport("txt")}
            className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl transition-colors border ${
              isDark 
                ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700" 
                : "bg-stone-50 hover:bg-stone-100 border-stone-200"
            }`}
          >
            <Upload className={`w-5 h-5 ${isDark ? "text-zinc-400" : "text-stone-500"}`} />
            <span className={isDark ? "text-zinc-300" : "text-stone-700"}>Download as .txt</span>
          </button>
        </div>
      </div>
    </div>
  );
}