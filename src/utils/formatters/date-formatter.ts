export function formatDate(inputDate: string): string {
  const [day, month, year] = inputDate.split("/").map(Number);
  const date = new Date(year, month - 1, day); // Month is 0-indexed

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}