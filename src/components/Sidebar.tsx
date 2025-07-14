import { FC } from "react";
import { GraduationCap, FileText, Command, Brain, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    currentPage: string;
    setCurrentPage: (newPage: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const navigate = useNavigate();

    const navItems = [
        { label: "Notes", icon: <FileText />, key: "notes", shortcut: "1" },
        { label: "Flashcards", icon: <Brain />, key: "flashcards", shortcut: "2" },
        { label: "Paramètres", icon: <Settings />, key: "settings", shortcut: "3" },
    ];

    const activeIndex = navItems.findIndex(item => item.key === currentPage);

    return (
        <div className="h-screen w-[15rem] gap-3 bg-background flex flex-col flex-shrink-0 border-r-2 border-border">
            <div className="h-[5rem] border-b-2 border-border flex justify-center items-center gap-3">
                <div className="w-[2.5rem] h-[2.5rem] rounded-xl bg-accent flex justify-center items-center">
                    <GraduationCap color="black" size={30} />
                </div>
                <h1 className="text-foreground text-xl font-bold">StudyFlow</h1>
            </div>

            <nav className="relative flex flex-col items-center mt-0 gap-2 flex-1">
                <div
                    className="absolute w-[13rem] h-[4.5rem] bg-accent rounded-xl transition-all duration-300 ease-in-out"
                    style={{ top: `${activeIndex * 5}rem` }}
                />

                {navItems.map((item) => (
                    <button
                        key={item.key}
                        className={`relative z-10 w-[12rem] h-[4.5rem] rounded-xl transition-all flex items-center justify-between focus:border-accent focus:border focus:border-2 ${
                            currentPage !== item.key ? "hover:bg-background2 hover:scale-105" : ""
                        }`}
                        onClick={() => {
                            navigate(`/pages/${item.key}`);
                            setCurrentPage(item.key);
                        }}
                    >
                        <div className={`flex items-center gap-1 ml-1 ${currentPage !== item.key ? "text-foreground2" : "text-black "}`}>
                            {item.icon}
                            <span className="text-lg">{item.label}</span>
                        </div>

                        <div className={`w-10 gap-1 p-1 mr-1 ${currentPage !== item.key ? "bg-[#1e2939]" : "bg-secondary"} flex justify-center items-center rounded-md text-foreground`}>
                            <Command size={18} />
                            <span>{item.shortcut}</span>
                        </div>
                    </button>
                ))}
            </nav>
        </div>
    );
};
