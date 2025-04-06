import { getCachedData } from "../helper/cacheHelper.ts";
import { findSupportAndResistance } from "../helper/analysisHelper.ts";

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const analyzeSupportAndResistanceBreakout = async (ticker: string) => {
  try {
    const cacheKeys = Deno.readDirSync("./json"); // Read all JSON files in the cache directory
    const breakoutSummary: Record<string, { type: string; yes: number; no: number }> = {}; // Summary for each price

    const tableData = Array.from(cacheKeys)
      .filter((file) => file.isFile && file.name.includes(ticker) && file.name.endsWith(".json")) // Filter files by ticker
      .flatMap((file) => {
        const cacheKey = file.name.replace(".json", ""); // Extract the cache key from the filename
        const data: any = getCachedData(cacheKey);

        if (!data || data.length === 0) {
          console.warn(`No data found for cache key: ${cacheKey}`);
          return [];
        }

        const { supports, resistances } = findSupportAndResistance(data);

        const supportBreakouts = supports
          .map((support: any) => {
            const breakoutIndex = data.findIndex((d: any) => d.close < support.price);
            if (breakoutIndex !== -1 && breakoutIndex + 7 < data.length) {
              const next7Days = data.slice(breakoutIndex + 1, breakoutIndex + 8);
              const averageClose = next7Days.reduce((sum: number, d: any) => sum + d.close, 0) / next7Days.length;
              const success = averageClose < support.price ? "Yes" : "No";

              // Update summary for support price
              if (!breakoutSummary[support.price]) {
                breakoutSummary[support.price] = { type: "Support", yes: 0, no: 0 };
              }
              breakoutSummary[support.price][success.toLowerCase() as "yes" | "no"]++;

              return {
                ticker: cacheKey,
                type: "Support Breakout",
                price: support.price,
                breakoutDate: formatDate(data[breakoutIndex].date),
                success: success === "Yes" ? "Yes (Harga turun terus)" : "No (Harga tidak turun lagi)",
              };
            }
            return null;
          })
          .filter((breakout: any) => breakout !== null);

        const resistanceBreakouts = resistances
          .map((resistance: any) => {
            const breakoutIndex = data.findIndex((d: any) => d.close > resistance.price);
            if (breakoutIndex !== -1 && breakoutIndex + 7 < data.length) {
              const next7Days = data.slice(breakoutIndex + 1, breakoutIndex + 8);
              const averageClose = next7Days.reduce((sum: number, d: any) => sum + d.close, 0) / next7Days.length;
              const success = averageClose > resistance.price ? "Yes" : "No";

              // Update summary for resistance price
              if (!breakoutSummary[resistance.price]) {
                breakoutSummary[resistance.price] = { type: "Resistance", yes: 0, no: 0 };
              }
              breakoutSummary[resistance.price][success.toLowerCase() as "yes" | "no"]++;

              return {
                ticker: cacheKey,
                type: "Resistance Breakout",
                price: resistance.price,
                breakoutDate: formatDate(data[breakoutIndex].date),
                success: success === "Yes" ? "Yes (Harga naik terus)" : "No (Harga tidak naik lagi)",
              };
            }
            return null;
          })
          .filter((breakout: any) => breakout !== null);

        return [...supportBreakouts, ...resistanceBreakouts];
      });

    console.table(tableData);

    // Print the summary for each price
    console.log("Breakout Summary:");
    console.table(
      Object.entries(breakoutSummary).map(([price, counts]) => ({
        price,
        type: counts.type, // Support or Resistance
        yes: counts.yes,
        no: counts.no,
      }))
    );
  } catch (error: any) {
    console.error("An unexpected error occurred:", error.message || error);
  }
};
