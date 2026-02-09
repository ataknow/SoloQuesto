import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Smartphone, Battery, Wifi, WifiOff, Download, Upload, Trash2, RefreshCw, CheckCircle, XCircle, Sun, Moon } from "lucide-react";

interface SettingsProps {
  onExport: (format: "txt") => void;
  onImport: (file: File) => void;
  onVoiceImport: () => void;
  onPhotoImport: () => void;
  onClearData: () => void;
  batteryLevel: number | null;
  isOnline: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Settings({
  onExport,
  onImport,
  onVoiceImport,
  onPhotoImport,
  onClearData,
  batteryLevel,
  isOnline,
  isDark,
  onToggleTheme,
}: SettingsProps) {
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectDevice = () => {
    if (isDeviceConnected) {
      setIsDeviceConnected(false);
      return;
    }

    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsDeviceConnected(true);
    }, 2000);
  };

  return (
    <div className={`p-4 space-y-6 pb-24 min-h-full transition-colors duration-300 ${
      isDark ? "bg-[#1A1A1A]" : "bg-stone-50"
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-stone-900"}`}>Settings</h2>

      {/* Appearance */}
      <Card className={`${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-stone-200"}`}>
        <CardHeader>
          <CardTitle className={`${isDark ? "text-white" : "text-stone-900"}`}>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
             isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-stone-50 border-stone-200"
          }`}>
             <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-600" />}
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-stone-900"}`}>
                  {isDark ? "Night Mode" : "Day Mode"}
                </p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-stone-500"}`}>
                  {isDark ? "Easy on the eyes" : "Ivory White theme"}
                </p>
              </div>
            </div>
            <Button
              onClick={onToggleTheme}
              variant="outline"
              className={isDark ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800" : "border-stone-300 text-stone-600 hover:bg-stone-100"}
            >
              Toggle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Status */}
      <Card className={`${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-stone-200"}`}>
        <CardHeader>
          <CardTitle className={`${isDark ? "text-white" : "text-stone-900"} flex items-center gap-2`}>
            <Smartphone className={`w-5 h-5 ${isDark ? "text-[#042861]" : "text-orange-500"}`} />
            Device Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-emerald-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-stone-900"}`}>Connection</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-stone-500"}`}>{isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Battery className={`w-5 h-5 ${isDark ? "text-zinc-400" : "text-stone-400"}`} />
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-stone-900"}`}>Battery</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-stone-500"}`}>
                  {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connect to Device */}
      <Card className={`${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-stone-200"}`}>
        <CardHeader>
          <CardTitle className={`${isDark ? "text-white" : "text-stone-900"}`}>Connect to Device</CardTitle>
          <CardDescription className={isDark ? "text-zinc-500" : "text-stone-500"}>
            Pair with another device to sync your lists automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
            isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-stone-50 border-stone-200"
          }`}>
            <div className="flex items-center gap-3">
              {isDeviceConnected ? (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              ) : (
                <XCircle className="w-6 h-6 text-stone-400" />
              )}
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-stone-900"}`}>
                  {isConnecting ? "Connecting..." : isDeviceConnected ? "iPhone 14 Pro" : "No Device Connected"}
                </p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-stone-500"}`}>
                  {isDeviceConnected ? "Sync active via local network" : "Tap connect to pair"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnectDevice}
              variant={isDeviceConnected ? "outline" : "default"}
              className={isDeviceConnected ? "border-stone-300 text-stone-600 hover:bg-stone-100" : ""}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : isDeviceConnected ? (
                "Disconnect"
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import / Export */}
      <Card className={`${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-stone-200"}`}>
        <CardHeader>
          <CardTitle className={`${isDark ? "text-white" : "text-stone-900"}`}>Import & Export</CardTitle>
          <CardDescription className={isDark ? "text-zinc-500" : "text-stone-500"}>
            Backup your data or import from other apps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => onExport("txt")}
            variant="outline"
            className={`w-full justify-start ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-stone-300 text-stone-600 hover:bg-stone-100"}`}
          >
            <Download className="w-4 h-4 mr-2" />
            Export as .txt
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImport(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              className={`w-full justify-start ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-stone-300 text-stone-600 hover:bg-stone-100"}`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import from .txt
            </Button>
          </div>

          <Button
            onClick={onVoiceImport}
            variant="outline"
            className={`w-full justify-start ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-stone-300 text-stone-600 hover:bg-stone-100"}`}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Voice Input
          </Button>

          <Button
            onClick={onPhotoImport}
            variant="outline"
            className={`w-full justify-start ${isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-stone-300 text-stone-600 hover:bg-stone-100"}`}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Scan Photo (OCR)
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className={`${isDark ? "bg-zinc-900 border-red-900/30" : "bg-white border-red-100"}`}>
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onClearData}
            variant="outline"
            className={`w-full ${isDark ? "border-red-900/50 text-red-400 hover:bg-red-900/20" : "border-red-200 text-red-500 hover:bg-red-50"}`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}