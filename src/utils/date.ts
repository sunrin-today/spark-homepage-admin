export function formatKoreanDate(date: string) {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).split("T")[0].padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
}
export function formatKoreanDateFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export const formatDateDash = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return isoDate;
  }
};
export function getRemainingDays(date: string) {
  const target = new Date(date);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays =
    Math.floor((target.getTime() - today.getTime()) / 86400000);

  if (diffDays >= 0) return `${diffDays}일 남음`;
  return `${Math.abs(diffDays)}일 지남`;
}
