export function getDateRange(interval: string): { period1: string; period2: string } {
  const now = new Date();
  let period1 = new Date();

  switch (interval) {
    case "1d":
      period1.setDate(now.getDate() - 1);
      break;
    case "1w":
      period1.setDate(now.getDate() - 7);
      break;
    case "1m":
      period1.setMonth(now.getMonth() - 1);
      break;
    case "1y":
      period1.setFullYear(now.getFullYear() - 1);
      break;
    case "ytd":
      period1 = new Date(now.getFullYear(), 0, 1); // Start of the year
      break;
    default:
      throw new Error("Invalid interval. Use '1d', '1w', '1m', '1y', or 'ytd'.");
  }

  return {
    period1: period1.toISOString().split("T")[0],
    period2: now.toISOString().split("T")[0],
  };
}