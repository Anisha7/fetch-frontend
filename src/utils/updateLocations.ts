import { Dog, Location, MapCoordinates } from "../types";

/**
 * Utility function that builds a mapping from dog ID to their approximate
 * geographic coordinates based on zip code. Applies slight random offsets
 * to avoid marker overlap in the UI.
 */
export const updateLocationsMap = (
  allLocations: Location[],
  dogsToUse: Dog[]
): Record<string, MapCoordinates> => {
  const locsMap: Record<string, MapCoordinates> = {};
  dogsToUse.forEach((dog) => {
    const match = allLocations.find(
      (loc) => loc?.zip_code === dog?.zip_code
    );
    const offsetLat = (Math.random() - 0.5) * 0.002;
    const offsetLng = (Math.random() - 0.5) * 0.002;
    if (match) {
      locsMap[dog.id] = {
        lat: match.latitude + offsetLat,
        lng: match.longitude + offsetLng,
      };
    }
  });
  return locsMap;
};
