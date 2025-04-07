import { API_URL } from ".";
import { Dog } from "../types";
import axios from 'axios';

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

export const getDogBreeds = async () =>
  await fetch(`${API_URL}/dogs/breeds`, {
    credentials: "include",
  });

// Filters dogs by search results
export const searchDogs = async (
  params: DogSearchParams
): Promise<DogSearchResponse> => {
  console.log(params)
  try {
    const response = await axios.get(`${API_URL}/dogs/search`, {
      params: {
        ...params,
        sort: params.sort || "breed:asc" // ascending by default
      },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "" // Some APIs require this even with cookies
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch dogs: ${error}`);
  }
};

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

// dogs match api
