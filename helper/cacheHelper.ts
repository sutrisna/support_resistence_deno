import { existsSync } from "https://deno.land/std/fs/mod.ts";

const CACHE_DIR = "./json"; // Directory to store cached data
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // Cache expiry time (1 day)

export const getCachedData = (key: string): any | null => {
  const cacheFile = `${CACHE_DIR}/${key}.json`;

  if (!existsSync(cacheFile)) {
    return null; // Cache file does not exist
  }

  try {
    const cacheContent = JSON.parse(Deno.readTextFileSync(cacheFile));
    const now = globalThis.Date.now(); // Use globalThis instead of window

    if (now - cacheContent.timestamp > CACHE_EXPIRY_MS) {
      return null; // Cache expired
    }

    return cacheContent.data; // Return cached data
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading cache for key "${key}":`, error.message);
    } else {
      console.error(`Error reading cache for key "${key}":`, error);
    }
    return null;
  }
};

export const setCachedData = (key: string, data: any): void => {
  const cacheFile = `${CACHE_DIR}/${key}.json`;

  try {
    const cacheContent = {
      timestamp: globalThis.Date.now(), // Use globalThis instead of window
      data, // Store data as-is without `originalDate`
    };

    if (!existsSync(CACHE_DIR)) {
      Deno.mkdirSync(CACHE_DIR); // Create cache directory if it doesn't exist
    }

    Deno.writeTextFileSync(cacheFile, JSON.stringify(cacheContent, null, 2));
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error writing cache for key "${key}":`, error.message);
    } else {
      console.error(`Error writing cache for key "${key}":`, error);
    }
  }
};
