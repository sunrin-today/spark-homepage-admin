export function getClaimStatusText(status: string) {
    switch (status) {
        case 'WAITING':
            return '승인대기중';
        case 'COMPLETED':
            return '승인 완료';
        case 'REJECTED':
            return '승인 거부';
        default:
            return '알 수 없음';
    }
}