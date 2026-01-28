export const ChargerStatusBadge = ({status}: {status: string}) => {
    const statusColor = {
        "not_rented": [ "bg-[#FA5353]/20 text-[#FA5353]", "미대여"],
        "renting": [ "bg-[#34B83D]/20 text-[#34B83D]", "대여중"],
        "waiting": [ "bg-[#ffb22d]/20 text-[#ffb22d]", "전달예정"],
    }[status];
    if (!statusColor) return null;
    return (
        <span className={`px-3 leading-normal py-1 text-sm font-medium rounded-[8px] ${statusColor[0]}`}>{statusColor[1]}</span>
    )
}