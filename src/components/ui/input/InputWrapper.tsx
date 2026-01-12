export const InputWrapper = ({label, htmlFor, children}: {label: string, htmlFor: string, children: React.ReactNode}) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-gray text-sm font-medium" htmlFor={htmlFor}>{label}</label>
            {children}
        </div>
    )
}