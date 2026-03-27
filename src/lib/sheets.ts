import Papa from 'papaparse';

export interface SheetData {
  [key: string]: string;
}

/**
 * Fetches and parses a Google Sheet published as CSV.
 * @param url The "Publish to Web" CSV URL.
 */
export async function fetchSheetData(url: string): Promise<SheetData[]> {
  try {
    const response = await fetch(url);
    const csvString = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as SheetData[]);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

// Example specific fetchers
export async function getIngredients() {
  const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET_INGREDIENTS_URL || '';
  return fetchSheetData(url);
}
