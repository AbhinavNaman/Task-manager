// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { getData, addBoard, deleteBoard } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import Headers from "./Header"; // Assuming you have a Header component for the page header

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = getData();
    setBoards(data.boards);
  }, []);

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    const newBoard = addBoard(newBoardName);
    setBoards(prev => [...prev, newBoard]);
    setNewBoardName("");
  };

  const handleDeleteBoard = (id) => {
    deleteBoard(id);
    setBoards(prev => prev.filter(board => board.id !== id));
  };

  const openBoard = (id) => {
    navigate(`/board/${id}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Boards</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="New board name"
          className="border p-2 rounded w-full"
        />
        <button onClick={handleCreateBoard} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </div>

      {boards.length === 0 ? (
        <p className="text-gray-600">No boards yet. Create one above!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {boards.map((board) => (
            <div key={board.id} className="border p-4 rounded bg-white shadow-md">
              <h2
                className="text-xl font-semibold cursor-pointer hover:underline"
                onClick={() => openBoard(board.id)}
              >
                {board.name}
              </h2>
              <button
                onClick={() => handleDeleteBoard(board.id)}
                className="mt-2 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
