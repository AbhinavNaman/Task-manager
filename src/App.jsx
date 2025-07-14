// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Board from "./components/Board";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/board/:id" element={<Board />} />
    </Routes>
  );
}

export default App;
