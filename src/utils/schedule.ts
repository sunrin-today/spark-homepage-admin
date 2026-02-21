export const SCHEDULE_COLORS: Record<string, string> = {
  council: "#6CA9FF",
  infosec: "#F79447",
  software: "#ECB220",
  itmanagement: "#85C879",
  contentsdesign: "#089ED5",
};

export function getScheduleColor(colorKey: string): string {
  return SCHEDULE_COLORS[colorKey] ?? colorKey;
}