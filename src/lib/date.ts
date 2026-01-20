export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
