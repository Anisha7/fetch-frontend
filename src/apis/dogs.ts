import { API_URL } from ".";
import { Dog } from "../types";

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
  const queryParams = new URLSearchParams();
  console.log("searchDogs with: ", params);

  if (params.breeds && params.breeds.length > 0) {
    params.breeds.forEach((breed) => queryParams.append("breeds", breed));
  }

  if (params.zipCodes && params.zipCodes.length > 0) {
    params.zipCodes.forEach((zip) => queryParams.append("zipCodes", zip));
  }

  if (params.ageMin !== undefined && params.ageMin !== null) {
    queryParams.append("ageMin", params.ageMin.toString());
  }

  if (params.ageMax !== undefined && params.ageMax !== null) {
    queryParams.append("ageMax", params.ageMax.toString());
  }

  if (params.size !== undefined && params.size !== null) {
    queryParams.append("size", params.size.toString());
  }
  if (params.from) queryParams.append("from", params.from.toString());
  queryParams.append("sort", params.sort || "breed:asc"); // ascending by default

  // search?breeds=Airedale&zipCodes=94101&ageMin=1&ageMax=1
  // const queryParams = Object.entries(params).filter(([key, value]) => value !== null).flatMap(([key, value]) => {
  //   return `${key}=${Array.isArray(value) ? value.join('&') : value}`.replaceAll(' ', '+')
  // }).join('&');
  console.log("TESTING: ", queryParams.toString());

  const url = `${API_URL}/dogs/search?${queryParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "", // Some APIs require this even with cookies
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dogs: ${response}`);
  }

  return response.json();
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
