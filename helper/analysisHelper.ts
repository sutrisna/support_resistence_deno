export const findSupportAndResistance = (prices: any[]) => {
  if (!Array.isArray(prices) || prices.length === 0) {
    console.warn("Invalid or empty prices data provided.");
    return { supports: [], resistances: [] };
  }

  const supportMap = new Map<number, { count: number; dates: string[] }>();
  const resistanceMap = new Map<number, { count: number; dates: string[] }>();

  const formatDate = (dateInput: number | string): string => {
    if (typeof dateInput === "number") {
      // Original data: Unix timestamp in seconds
      if (dateInput > 9999999999) {
        dateInput = Math.floor(dateInput / 1000); // Convert milliseconds to seconds
      }

      if (isNaN(dateInput) || dateInput <= 0) {
        console.warn(`Invalid timestamp: ${dateInput}`);
        return "Invalid Date";
      }

      const date = new Date(dateInput * 1000); // Convert Unix timestamp to milliseconds
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (typeof dateInput === "string") {
      // Cached data: ISO string
      const date = new Date(dateInput);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } else {
      console.warn(`Invalid date input: ${dateInput}`);
      return "Invalid Date";
    }
  };

  for (let i = 1; i < prices.length; i++) {
    const prevClose = prices[i - 1].close;
    const currClose = prices[i].close;
    const currDate = formatDate(prices[i].date); // Use the updated formatDate function

    if (currClose < prevClose) {
      if (!supportMap.has(currClose)) {
        supportMap.set(currClose, { count: 0, dates: [] });
      }
      const support = supportMap.get(currClose)!;
      support.count++;
      support.dates.push(currDate);
    } else if (currClose > prevClose) {
      if (!resistanceMap.has(currClose)) {
        resistanceMap.set(currClose, { count: 0, dates: [] });
      }
      const resistance = resistanceMap.get(currClose)!;
      resistance.count++;
      resistance.dates.push(currDate);
    }
  }

  const supports = Array.from(supportMap.entries())
    .filter(([_, value]) => value.count >= 2)
    .map(([price, value]) => ({
      price,
      total: value.count,
      dates: value.dates,
    }));

  const resistances = Array.from(resistanceMap.entries())
    .filter(([_, value]) => value.count >= 2)
    .map(([price, value]) => ({
      price,
      total: value.count,
      dates: value.dates,
    }));

  // console.log("Supports:", supports); // Debug log for supports
  // console.log("Resistances:", resistances); // Debug log for resistances

  return { supports, resistances };
};
