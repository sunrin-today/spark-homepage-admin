export function getChargerStatusText(status: string) {
    switch (status) {
        case "renting":
            return "대여중";
        case "waiting":
            return "전달예정";
        case "not_rented":
            return "미대여";
        default:
            return "알 수 없음";
    }
}