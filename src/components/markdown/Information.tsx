import { Info } from "lucide-react";

interface InformationProps {
    information: string
}

export default function Information({ information }: InformationProps) {
    return (
        <div className="w-full h-fit flex items-center justify-between text-accent mt-5 bg-background2 border border-accent rounded-lg px-4 py-2">
            <Info className="h-full" />
            <span className="text-xl text-center">{information}</span>
            <div />
        </div>

    );
}