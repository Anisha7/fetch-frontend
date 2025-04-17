import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Pagination, Grid2 } from "@mui/material";
import { styled } from "@mui/material/styles";
import { fetchDogsById, searchDogs } from "../../apis/dogs";
import { getLocations, searchLocations } from "../../apis/locations";
import { Dog } from "../../types";
import DogMap from "./Map";
import DogCard from "../dog/DogCard";
import { useSearchParamsObject } from "../../hooks/useSearchParamsObject";
import { updateLocationsMap } from "../../utils/updateLocations";
import { boundsToBox, fetchDogsFromLocations, shouldRefetchBounds } from "../../utils/map";

const ListingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100vh",
  width: "50%",
  overflowY: "auto",
}));

const MapContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "50%",
  position: "sticky",
  top: 0,
}));

const ITEMS_PER_PAGE = 25;

/**
 * Main SearchResults component responsible for:
 * - Fetching dogs and their locations
 * - Displaying a paginated list of results
 * - Updating results based on map bounds
 * - Rendering the interactive dog map
 */
const SearchResults: React.FC = () => {
  // === State ===
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [locations, setLocations] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialBounds, setInitialBounds] = useState<google.maps.LatLngBounds | null>(null);

  const isInitialLoadRef = useRef(true);
  const lastBoundsRef = useRef<google.maps.LatLngBounds | null>(null);

  const searchParams = useSearchParamsObject();

  // === Methods ===
  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => setPage(value);

  const handleBoundsChanged = useCallback(
    async (bounds: google.maps.LatLngBounds) => {
      if (isInitialLoadRef.current) return;
      if (!shouldRefetchBounds(bounds, lastBoundsRef.current)) return;
      if (isLoading) return;
  
      setIsLoading(true);
      lastBoundsRef.current = bounds;
  
      try {
        const geoBoundingBox = boundsToBox(bounds);
        const locationResults = await searchLocations({ geoBoundingBox });
  
        if (locationResults.total > 0) {
          const { searchData, dogsData, locationMap } = await fetchDogsFromLocations(
            locationResults.results,
            searchParams
          );
  
          setData(searchData);
          setDogs(dogsData);
          setLocations(locationMap);
        }
      } catch (err) {
        console.error("Error during map-bound search", err);
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams, isLoading]
  );

  // === 🎯 Search param effect ===
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await searchDogs({
          size: ITEMS_PER_PAGE,
          from: (page - 1) * ITEMS_PER_PAGE,
          ...searchParams,
        });
        setData(res);
      } catch (err) {
        console.error("Initial dog search error:", err);
      }
    };
    fetchSearch();
  }, [searchParams, page]);

  // === 📍 Fetch dogs + locations ===
  useEffect(() => {
    const loadDogs = async () => {
      if (!data?.resultIds?.length) return;
      const dogList = await fetchDogsById(data.resultIds);
      setDogs(dogList);

      const uniqueZipCodes = Array.from(new Set(dogList.map(d => d.zip_code)));
      const allLocations = await getLocations(uniqueZipCodes);
      const locationMap = updateLocationsMap(allLocations, dogList);
      setLocations(locationMap);
    };
    loadDogs();
  }, [data?.resultIds]);

  return (
    <Box display="flex">
      <ListingsContainer>
        <Grid2 container spacing={2}>
          {dogs.map((dog) => (
            <DogCard key={dog.id} listing={dog} />
          ))}
        </Grid2>
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil((data?.total || 0) / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </ListingsContainer>

      <MapContainer>
        <DogMap
          dogs={dogs}
          locations={locations}
          onBoundsChanged={handleBoundsChanged}
          initialBounds={initialBounds || undefined}
        />
      </MapContainer>
    </Box>
  );
};

export default SearchResults;