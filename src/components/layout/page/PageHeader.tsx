import { ChevronLeft } from "lucide-react";

export default function PageHeader({ title, isBackButton }: { title: string; isBackButton?: boolean }) {
    
    return (
        <div className="flex items-center gap-2 mb-8">
            {isBackButton && <ChevronLeft onClick={() => window.history.back()} className="cursor-pointer" />}
            <h1 className="font-semibold text-xl text-[#000000]">{title}</h1>
        </div>
    );
}