import { ChevronLeft } from "lucide-react";

export default function PageHeader({ title, isBackButton, children }: { title: string; isBackButton?: boolean; children?: React.ReactNode }) {
    
    return (
        <div className="w-full flex justify-between">
            <div className="flex items-center gap-2 px-2 py-1">
                {isBackButton && <ChevronLeft onClick={() => window.history.back()} className="cursor-pointer" />}
                <h1 className="font-semibold text-xl text-[#000000]">{title}</h1>
            </div>
            {children}
        </div>
    );
}