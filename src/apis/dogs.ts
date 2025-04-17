import { API_URL } from ".";
import { Dog } from "../types";
import axios from "axios";

export interface DogSearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?:
    | "breed:asc"
    | "breed:desc"
    | "name:asc"
    | "name:desc"
    | "age:asc"
    | "age:desc";
}

// API Response Type
export interface DogSearchResponse {
  resultIds: string[]; // Array of Dog IDs matching the query
  total: number; // Total number of matched results
  next?: string; // Query string for the next page (if available)
  prev?: string; // Query string for the previous page (if available)
}

export interface Match {
  match: string;
}

/**
 * Fetches a list of all available dog breeds from the API.
 * Includes credentials for session-based authentication.
 *
 * @returns A Promise resolving to the fetch response.
 */
export const getDogBreeds = async () =>
  await fetch(`${API_URL}/dogs/breeds`, {
    credentials: "include",
  });

/**
 * Searches for dogs based on filter parameters including breed, zip code, age, etc.
 * Sorts results in ascending order of breed by default.
 *
 * @param params - Filters and pagination options for the search query.
 * @returns A Promise resolving to a DogSearchResponse object.
 * @throws Error if the API call fails.
 */
export const searchDogs = async (
  params: DogSearchParams
): Promise<DogSearchResponse> => {
  try {
    const response = await axios.get(`${API_URL}/dogs/search`, {
      params: {
        ...params,
        sort: params.sort || "breed:asc", // ascending by default
      },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "", // Some APIs require this even with cookies
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch dogs: ${error}`);
  }
};

/**
 * Fetches detailed dog objects given a list of dog IDs.
 * Throws an error if more than 100 IDs are provided.
 *
 * @param dogs - An array of dog ID strings to fetch.
 * @returns A Promise resolving to an array of Dog objects.
 * @throws Error if the response is not successful or the input size exceeds 100.
 */
export const fetchDogsById = async (dogs: string[]): Promise<Dog[]> => {
  if (dogs?.length > 100)
    throw new Error("dogs request must have less than 100 ids");
  const response = await fetch(`${API_URL}/dogs`, {
    method: "POST",
    body: JSON.stringify(dogs),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  }

  return response.json();
};

/**
 * Sends a list of favorited dog IDs to the match endpoint to receive a single best match.
 *
 * @param dogs - An array of dog ID strings the user has favorited.
 * @returns A Promise resolving to a Match object containing the matched dog ID.
 * @throws Error if the match request fails.
 */
export const matchDog = async (dogs: string[]): Promise<Match> => {
  const response = await fetch(`${API_URL}/dogs/match`, {
    method: "POST",
    body: JSON.stringify(dogs),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Match request failed with status: ${response.status}`);
  }

  return response.json();
};
