export const DateFormate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    dayPeriod: "narrow",
    hourCycle: "h12",
    weekday: "short",
  });
};
