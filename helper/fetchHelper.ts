import yahooFinance from "npm:yahoo-finance2";
import { getCachedData, setCachedData } from "./cacheHelper.ts";

export const fetchHistoricalPrices = async (
  ticker: string,
  period1: string,
  period2: string,
  interval: "1d" | "1wk" | "1mo" | undefined
) => {
  const cacheKey = `${ticker}_${period1}_${period2}_${interval}`;
  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    console.log(`Using cached data for ${ticker}`);
    return cachedData; // Return cached data if available
  }

  try {
    const result = await yahooFinance.historical(ticker, {
      period1,
      period2,
      interval,
    });

    if (!Array.isArray(result)) {
      throw new Error(`Unexpected response format for ticker: ${ticker}`);
    }

    setCachedData(cacheKey, result); // Cache the fetched data
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch historical prices for ${ticker}:`, error.message);
    } else {
      console.error(`Unknown error fetching historical prices for ${ticker}:`, error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};
