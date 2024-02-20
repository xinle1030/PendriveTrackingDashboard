export function formatDate(date: Date | String) {
  if (typeof date === "string") {
    const newDate = new Date(date);
    return dateToStr(newDate);
  } else if (date instanceof Date) {
    return dateToStr(date);
  }else {
    // Handle other cases or throw an error based on your requirements
    console.log(date);
    throw new Error("Invalid date format");
  }
}

export function dateToStr(date: Date): string {
  // Get year, month, and day parts from the date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // Generate yyyy-mm-dd date string
  return `${year}-${month}-${day}`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getSeverity(status: number): string | null {
  switch (status) {
    case 1:
      return "success";

    case 2:
      return "info";

    case 3:
      return "warning";

    case 4:
      return "danger";

    case 5:
      return "primary";

    case 6:
      return "help";

    default:
      return null;
  }
}
