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
      <div className="wrapper">
        <p>Favorites:</p>
        <div className="section">
          <Button title="Import" onClick={handleImport} />
          <Button title="Export" onClick={handleExport} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
