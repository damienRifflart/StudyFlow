import { FileText } from "lucide-react";

export default function Notes() {
    return (
        <div className="w-full bg-background flex flex-row">
            <div className="w-[15rem] border-r-2 border-border h-full">
            </div>

            <div className="h-full w-full flex flex-col justify-center items-center text-foreground2 gap-2">
                <FileText size={50} />
                <span className="text-lg">Aucune note de sélectionnée.</span>
                <span className="text-lg">Sélectionnez une note dans l'arborescence.</span>
            </div>
        </div>
    );
}