import { fetchHistoricalPrices } from "../helper/fetchHelper.ts";
import { findSupportAndResistance } from "../helper/analysisHelper.ts";
import { getDateRange } from "../helper/dateHelper.ts";

export const analyzeSupportAndResistance = async (tickers: string[], interval: "ytd" | "1d" | "1wk" | "1mo") => {
  const { period1, period2 } = getDateRange(interval);

  try {
    const historicalPrices = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const data = await fetchHistoricalPrices(ticker, period1, period2, "1d");
          return { ticker, data };
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error fetching data for ${ticker}:`, error.message);
          } else {
            console.error(`Unknown error fetching data for ${ticker}:`, error);
          }
          return { ticker, data: [] }; // Return empty data for failed fetch
        }
      })
    );

    const tableData = historicalPrices.flatMap(({ ticker, data }) => {
      if (data.length === 0) {
        return [
          {
            ticker,
            type: "Support",
            price: NaN,
            total: 0,
            dates: "N/A",
          },
          {
            ticker,
            type: "Resistance",
            price: "N/A",
            total: 0,
            dates: "N/A",
          },
        ];
      }

      const { supports, resistances } = findSupportAndResistance(data);

      const supportRows = supports.map((s) => ({
        ticker,
        type: "Support",
        price: s.price,
        total: s.total,
        dates: s.dates.join(", "),
      }));

      const resistanceRows = resistances.map((r) => ({
        ticker,
        type: "Resistance",
        price: r.price,
        total: r.total,
        dates: r.dates.join(", "),
      }));

      return [...supportRows, ...resistanceRows];
    });

    console.table(tableData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("An unexpected error occurred:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
};
