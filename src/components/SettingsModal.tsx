import { Button } from "../components/ui/button";
import { Download, Trash2, Info } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackup: () => void;
  onResetData: () => void;
  isDark: boolean;
}

export function SettingsModal({ isOpen, onClose, onBackup, onResetData, isDark }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`w-full max-w-md rounded-2xl p-6 ${isDark ? "bg-zinc-900" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-6">Impostazioni</h2>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${isDark ? "bg-zinc-800" : "bg-zinc-50"}`}>
            <h3 className="font-semibold mb-2">Backup dati</h3>
            <p className={`text-sm mb-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Esporta tutte le tue liste e task in un file di testo.
            </p>
            <Button onClick={onBackup} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Scarica Backup
            </Button>
          </div>

          <div className={`p-4 rounded-lg border border-red-200 dark:border-red-900`}>
            <h3 className="font-semibold mb-2 text-red-600">Zona pericolo</h3>
            <p className={`text-sm mb-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Cancella tutte le liste e task. Questa azione è irreversibile.
            </p>
            <Button onClick={onResetData} variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Cancella tutto
            </Button>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? "bg-zinc-800" : "bg-zinc-50"}`}>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-zinc-500" />
              <h3 className="font-semibold">Info</h3>
            </div>
            <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              FocusList v1.0.0<br />
              Creato con ❤️ per la produttività
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={onClose} className="w-full mt-6">
          Chiudi
        </Button>
      </div>
    </div>
  );
}