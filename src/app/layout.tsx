import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Notes from "./pages/Notes";
import Flashcards from "./pages/Flashcards";
import Settings from "./pages/Settings";
import "./App.css";
import { Sidebar } from "../components/Sidebar";
import { invoke } from '@tauri-apps/api/core';

function App() {
    const [currentPage, setCurrentPage] = useState<string>("notes");
    const navigate = useNavigate();

    invoke('my_custom_command', { invokeMessage: 'Hello!' });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                switch (event.code) {
                    case "Digit1":
                        navigate("/pages/notes");
                        setCurrentPage("notes");
                        break;
                    case "Digit2":
                        navigate("/pages/flashcards");
                        setCurrentPage("flashcards");
                        break;
                    case "Digit3":
                        navigate("/pages/settings");
                        setCurrentPage("settings");
                        break;

                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex flex-row h-screen w-screen">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <Routes>
                <Route path="/" element={<Navigate to="/pages/notes" replace />} />
                <Route path="/pages/notes" element={<Notes />} />
                <Route path="/pages/flashcards" element={<Flashcards />} />
                <Route path="/pages/settings" element={<Settings />} />
            </Routes>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
