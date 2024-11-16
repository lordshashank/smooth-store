export const getFormattedDate = (givenDate: Date): string => {
  const date = new Date(givenDate);
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return formattedDate;
};
