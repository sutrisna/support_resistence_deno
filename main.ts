import { analyzeSupportAndResistance } from "./analisa/support_resistence.ts";
import { analyzeSupportAndResistanceBreakout } from "./analisa/support_resistence_breakout.ts";

const tickers = ["AKRA.JK"]; // Array of tickers
const interval = "ytd" as const; // Use const assertion instead of a literal type annotation

// Analyze support and resistance
await analyzeSupportAndResistance(tickers, interval);

// Wait for a short delay to ensure the JSON file is written
await new Promise((resolve) => setTimeout(resolve, 1000));

// Analyze support and resistance breakouts
await analyzeSupportAndResistanceBreakout();
