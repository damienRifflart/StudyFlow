import { FC } from "react";

interface SidebarProps {
    nav: string;
}

export const Sidebar: FC<SidebarProps> = ({ nav }) => {

    return(
        <div className="h-screen w-[15rem] bg-backgroundNav">
            <h1 className="text-foregroundNav">Navbar</h1>
        </div>
    )
}