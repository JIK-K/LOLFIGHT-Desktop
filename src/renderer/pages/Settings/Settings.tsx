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
    <div className="settings-page">
      <div className="wrapper">
        <p>Favorites:</p>
        <div className="section">
          <Button title="Import" onClick={handleImport} />
          <Button title="Export" onClick={handleExport} />
        </div>
      </div>
      <div
        className="h-[50px] w-[150px] p-2 overflow-y-scroll text-sm bg-gray-800"
        style={{ maxHeight: "200px" }}
      >
        {/* 스크롤이 필요한 내용 */}
        아아아아아앙아아아아아앙아아아아아앙아아아아아앙아아아아아앙아아아아아앙아아아아아앙...
      </div>
    </div>
  );
};

export default Settings;
