import useDarkMode from "../utils/useDarkMode";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-6 py-3 shadow bg-white dark:bg-gray-800 dark:text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className=" hover:underline hover:cursor-pointer flex items-center gap-2"
      >
        <h1 className="text-xl font-semibold">Task Manager</h1>
      </button>
      {/* <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 text-sm"
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button> */}
    </header>
  );
}

export default Header;
