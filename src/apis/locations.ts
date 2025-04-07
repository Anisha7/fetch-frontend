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
