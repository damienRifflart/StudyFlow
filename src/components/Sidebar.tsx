import { FC } from "react";
import { GraduationCap, FileText, Command, Brain, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    currentPage: string;
    setCurrentPage: (newPage: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const navigate = useNavigate();

    return(
        <div className="h-screen w-[18rem] bg-background flex flex-col flex-shrink-0">
            <div className="h-[5rem] border-b-2 border-r-2 border-border flex justify-center items-center gap-3">
                <div className="w-[2.5rem] h-[2.5rem] rounded-xl bg-accent flex justify-center items-center">
                    <GraduationCap color="black" size={30} />
                </div>
                <h1 className="text-foreground text-xl font-bold">StudyFlow</h1>
            </div>

            <div className="h-full border-r-2 border-border">
                <nav className="z-50 text-background gap-5 flex flex-col h-full flex items-center">
                    <button className={`w-[15rem] p-2 mt-5 rounded-xl ${currentPage === "notes" ? "bg-accent" : "hover:bg-background2 hover:scale-105 transition-all"}`} onClick={() => (navigate('/pages/notes'), setCurrentPage('notes'))}>
                        <div className="flex flex-row w-full items-center gap-3 ml-2 justify-between">
                            <div className={`flex flex-row items-center gap-3 ${currentPage !== "notes" ? "text-foreground2" : ""}`}>
                                <FileText />
                                <span className="text-lg">Notes</span>
                            </div>
                            
                            <div className={`w-14 h-9 mr-2 gap-1 ${currentPage !== "notes" ? "bg-[#1e2939]" : "bg-secondary"} flex flex-row justify-center items-center rounded-md text-foreground`}>
                                <Command size={18} />
                                <span>1</span>
                            </div>
                        </div>
                    </button>


                    <button className={`w-[15rem] p-2 rounded-xl ${currentPage === "flashcards" ? "bg-accent" : "hover:bg-background2 hover:scale-105 transition-all"}`} onClick={() => (navigate('/pages/flashcards'), setCurrentPage('flashcards'))}>
                        <div className="flex flex-row w-full items-center gap-3 ml-2 justify-between">
                            <div className={`flex flex-row items-center gap-3 ${currentPage !== "flashcards" ? "text-foreground2" : ""}`}>
                                <Brain />
                                <span className="text-lg">Flashcards</span>
                            </div>
                            
                            <div className={`w-14 h-9 mr-2 gap-1 ${currentPage !== "flashcards" ? "bg-[#1e2939]" : "bg-secondary"} flex flex-row justify-center items-center rounded-md text-foreground`}>
                                <Command size={18} />
                                <span>2</span>
                            </div>
                        </div>
                    </button>

                    <button className={`w-[15rem] p-2 rounded-xl ${currentPage === "settings" ? "bg-accent" : "hover:bg-background2 hover:scale-105 transition-all"}`} onClick={() => (navigate('/pages/settings'), setCurrentPage('settings'))}>
                        <div className="flex flex-row w-full items-center gap-3 ml-2 justify-between">
                            <div className={`flex flex-row items-center gap-3 ${currentPage !== "settings" ? "text-foreground2" : ""}`}>
                                <Settings />
                                <span className="text-lg">Paramètres</span>
                            </div>
                            
                            <div className={`w-14 h-9 mr-2 gap-1 ${currentPage !== "settings" ? "bg-[#1e2939]" : "bg-secondary"} flex flex-row justify-center items-center rounded-md text-foreground`} >
                                <Command size={18} />
                                <span>3</span>
                            </div>
                        </div>
                    </button>
                </nav>    
            </div>
        </div>
    )
}