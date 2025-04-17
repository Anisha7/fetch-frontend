import { fetchDogsById, searchDogs } from "../apis/dogs";
import { useSearchParamsObject } from "../hooks/useSearchParamsObject";
import { updateLocationsMap } from "./updateLocations";
import { Location } from "../types";

/**
 * Compares current and last bounds to determine if a refetch is needed.
 * Returns true if bounds have changed significantly.
 */
export const shouldRefetchBounds = (
  current: google.maps.LatLngBounds,
  last: google.maps.LatLngBounds | null,
  threshold: number = 0.1
): boolean => {
  if (!last) return true;

  const curr = current.toJSON();
  const prev = last.toJSON();

  return (
    Math.abs(curr.north - prev.north) > threshold ||
    Math.abs(curr.south - prev.south) > threshold ||
    Math.abs(curr.east - prev.east) > threshold ||
    Math.abs(curr.west - prev.west) > threshold
  );
};

/**
 * Converts a Google Maps LatLngBounds object to a bounding box format
 * compatible with the geoBoundingBox API input.
 */
export const boundsToBox = (bounds: google.maps.LatLngBounds) => {
  const { north, south, east, west } = bounds.toJSON();
  return {
    top: north,
    bottom: south,
    left: west,
    right: east,
  };
};

/**
 * Fetches dog search results and their corresponding location map from a list of locations.
 * Used in cases where a zip code-based search needs to be done from geo-coordinates.
 */
export const fetchDogsFromLocations = async (
  locations: Location[],
  params: ReturnType<typeof useSearchParamsObject>
) => {
  const zipCodes = locations.map((loc) => loc.zip_code);

  const searchData = await searchDogs({
    size: 25,
    from: 0,
    ...params,
    zipCodes,
  });

  const dogsData = await fetchDogsById(searchData.resultIds);
  const locationMap = updateLocationsMap(locations, dogsData);

  return { searchData, dogsData, locationMap };
};
