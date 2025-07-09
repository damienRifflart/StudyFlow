import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./pages/Notes";
import Flashcards from "./pages/Flashcards";
import Settings from "./pages/Settings";
import "./App.css";
import { Sidebar } from "../components/Sidebar";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("notes");

  return (
    <BrowserRouter>
      <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <Routes>
          <Route path="/pages/notes" element={<Notes />} />
          <Route path="/pages/flashcards" element={<Flashcards />} />
          <Route path="/pages/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
