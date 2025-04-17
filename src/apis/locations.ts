import { Location, Coordinates } from "../types";
import { API_URL } from ".";
import axios from "axios";

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: Coordinates;
    top_right?: Coordinates;
    bottom_right?: Coordinates;
    top_left?: Coordinates;
  };
  size?: number;
  from?: number;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

/**
 * Fetches location details (latitude and longitude) for a list of ZIP codes.
 * Limited to a maximum of 100 ZIP codes per request.
 *
 * @param zipCodes - An array of ZIP code strings to look up.
 * @returns A Promise resolving to an array of Location objects.
 * @throws Error if the ZIP code limit is exceeded or the API call fails.
 */
export const getLocations = async (zipCodes: string[]): Promise<Location[]> => {
  if (zipCodes.length > 100) {
    throw new Error("Cannot request more than 100 ZIP codes at once");
  }

  const response = await fetch(`${API_URL}/locations`, {
    method: "POST",
    body: JSON.stringify(zipCodes),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status}`);
  }

  return response.json();
};

/**
 * Searches for locations based on optional filters such as city, state,
 * and geographic bounding boxes. Supports pagination.
 *
 * @param params - Location search filters and options.
 * @returns A Promise resolving to a LocationSearchResponse with matching results and total count.
 * @throws Error if the API call fails.
 */
export const searchLocations = async (
  params: LocationSearchParams
): Promise<LocationSearchResponse> => {
  try {
    const response = await axios.post(`${API_URL}/locations/search`, params, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to search locations: ${error}`);
  }
};
