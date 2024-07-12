import * as React from "react";
import { exportFavorites, importFavorites } from "../../utils/ipcBridge";
import { Button } from "../../components";
import { toast } from "react-hot-toast";
import "./Settings.scss";

const Settings: React.FC = () => {
  async function handleImport() {
    const success = await importFavorites();
    if (success) toast.success("Imported favorites");
    else toast.error("Failed to import");
  }

  async function handleExport() {
    const success = await exportFavorites();
    if (success) toast.success("Exported favorites");
    else toast.error("Failed to export");
  }
  return (
    <div className="settings-page px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col items-center rounded-lg border text-card-foreground shadow-sm bg-gray-800 border-gray-700">
        <div className="flex w-full bg-gray-900 rounded-t-lg space-y-1.5 p-6 border-b border-gray-700 px-6 py-4">
          내정보
        </div>
        <div className="relative w-full justify-center flex items-center gap-2 p-4"></div>
      </div>
    </div>
  );
};

export default Settings;
