import { ChevronLeft } from "lucide-react";

export default function PageHeader({ title, isBackButton, children }: { title: string; isBackButton?: boolean; children?: React.ReactNode }) {
    
    return (
        <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex items-center gap-2 px-2 py-1">
                {isBackButton && <ChevronLeft onClick={() => window.history.back()} className="cursor-pointer flex-shrink-0" />}
                <h1 className="font-semibold text-lg sm:text-xl text-black break-words">{title}</h1>
            </div>
            {children && (
                <div className="px-2 sm:px-0">
                    {children}
                </div>
            )}
        </div>
    );
}