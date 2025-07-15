import useDarkMode from "../utils/useDarkMode";
import { Moon, Sun, Upload, Download } from "lucide-react";
import { getData, saveData } from "../utils/storage";
import { useNavigate } from "react-router-dom";

function Header() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const navigate = useNavigate();

  // Export handler
  const handleExport = () => {
    const data = getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "task-manager-backup.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  // Import handler
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // Validate structure
      if (!parsed.boards || !Array.isArray(parsed.boards)) {
        alert("Invalid file structure.");
        return;
      }

      saveData(parsed);
      alert("Import successful! Reloading...");
      window.location.reload();
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 dark:text-white shadow">
      <button
        onClick={() => navigate("/dashboard")}
        className=" hover:underline hover:cursor-pointer flex items-center gap-2"
      >
        <h1 className="text-xl font-semibold">Task Manager</h1>
      </button>
      <div className="flex items-center gap-4">
        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded"
        >
          <Download size={16} /> Export
        </button>

        {/* Import */}
        <label className="relative cursor-pointer bg-green-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1">
          <Upload size={16} /> Import
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 text-sm"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
